import * as React from 'react';
import { Link, useNavigate } from 'react-router';
import {
    Plus,
    Download,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    ChevronUp,
    Loader2,
    BarChart3,
    CheckCircle,
    AlertCircle,
    List,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MetricCard } from '@/components/shared/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {
    useAssessments,
    useDeleteAssessment,
    usePublishAssessment,
} from '@/features/assessments/queries';
import { SubmissionPacingChart } from '@/components/shared/SubmissionPacingChart';
import { IntegrityDonutChart } from '@/components/shared/IntegrityDonutChart';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export function AssessmentsPage() {
    const navigate = useNavigate();

    /* ── Data ─────────────────────────────────────── */
    const { data: assessments, isLoading, error, refetch, isRefetching } = useAssessments();
    const deleteMutation = useDeleteAssessment();
    const publishMutation = usePublishAssessment();

    /* ── Filter & Sort State ──────────────────────── */
    const [search, setSearch] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('all');
    const [courseFilter, setCourseFilter] = React.useState('all');
    const [sortBy, setSortBy] = React.useState('recent');
    const [currentPage, setCurrentPage] = React.useState(1);

    /* ── Selection & Action State ─────────────────── */
    const [selectedAssessments, setSelectedAssessments] = React.useState<string[]>([]);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [publishingId, setPublishingId] = React.useState<string | null>(null);
    const [isExporting, setIsExporting] = React.useState(false);

    /* ── Derived: Filtered & Paginated ────────────── */
    const filtered = React.useMemo(() => {
        if (!assessments) return [];
        let result = assessments.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.joinCode.toLowerCase().includes(search.toLowerCase());
            const matchesTab = activeTab === 'all' || item.status === activeTab;
            const matchesCourse = courseFilter === 'all' || item.courseCode?.toLowerCase().includes(courseFilter.toLowerCase());
            return matchesSearch && matchesTab && matchesCourse;
        });

        if (sortBy === 'recent') {
            result = [...result].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        } else if (sortBy === 'name') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'status') {
            const statusOrder = { published: 0, draft: 1, closed: 2 };
            result = [...result].sort((a, b) => (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0));
        }

        return result;
    }, [assessments, search, activeTab, courseFilter, sortBy]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, activeTab, courseFilter, sortBy]);

    /* ── Handlers ─────────────────────────────────── */
    const toggleSelect = (id: string) => {
        setSelectedAssessments((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        if (selectedAssessments.length === paginatedItems.length && paginatedItems.length > 0) {
            setSelectedAssessments([]);
        } else {
            setSelectedAssessments(paginatedItems.map((a) => a.id));
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId, {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setDeleteId(null);
                    setSelectedAssessments((prev) => prev.filter((v) => v !== deleteId));
                },
            });
        }
    };

    const handlePublish = (id: string) => {
        setPublishingId(id);
        publishMutation.mutate(id, {
            onSuccess: () => {
                setPublishingId(null);
                toast.success('Assessment published successfully');
            },
            onError: () => {
                setPublishingId(null);
                toast.error('Failed to publish assessment');
            },
        });
    };

    const handleExport = () => {
        setIsExporting(true);
        // Simulate export
        setTimeout(() => {
            setIsExporting(false);
            toast.success('Summary exported successfully');
        }, 1500);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleView = (id: string) => {
        navigate(`/assessments/${id}`);
    };

    const handleEdit = () => {
        navigate('/assessments/new');
    };

    const handleViewAnalytics = (id: string) => {
        navigate(`/assessments/${id}/analytics`);
    };

    /* ── Computed Counts ──────────────────────────── */
    const publishedCount = assessments?.filter((a) => a.status === 'published').length ?? 0;
    const draftCount = assessments?.filter((a) => a.status === 'draft').length ?? 0;
    const closedCount = assessments?.filter((a) => a.status === 'closed').length ?? 0;
    const totalCount = assessments?.length ?? 0;
    const allSelected = paginatedItems.length > 0 && selectedAssessments.length === paginatedItems.length;
    const someSelected = selectedAssessments.length > 0;

    const tabs = [
        { label: 'All Assessments', value: 'all', count: totalCount },
        { label: 'Published', value: 'published', count: publishedCount },
        { label: 'Draft', value: 'draft', count: draftCount },
        { label: 'Closed', value: 'closed', count: closedCount },
    ];

    /* ── Loading State ────────────────────────────── */
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
                    <div className="h-9 bg-slate-200 rounded w-32 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                            <div className="flex items-baseline gap-2">
                                <div className="h-8 bg-slate-200 rounded w-16 animate-pulse" />
                                <div className="h-3 bg-slate-200 rounded w-20 animate-pulse" />
                            </div>
                            <div className="h-3 bg-slate-200 rounded w-28 animate-pulse" />
                        </div>
                    ))}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
                        <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
                        <div className="h-8 bg-slate-200 rounded w-24 animate-pulse" />
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3 px-6 border-b border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
                                <div className="space-y-1.5">
                                    <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                                    <div className="h-3 bg-slate-200 rounded w-32 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-4 bg-slate-200 rounded w-12 animate-pulse" />
                                <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                                <div className="h-7 bg-slate-200 rounded w-16 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ── Error State ──────────────────────────────── */
    if (error) {
        return (
            <ErrorState
                title="Failed to load assessments"
                message="We couldn't fetch your assessments. Please check your connection and try again."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Page Header ─────────────────────────── */}
            <PageHeader
                title="Assessments"
                description="Manage, organize, and monitor your assessments across courses and cohorts."
                contextLabel="ACADEMIC TERM 2024-2025"
                contextDescription="Department of Computer Science"
                actions={
                    <>
                        <Button
                            variant="outline"
                            className="gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                            onClick={handleExport}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                                {isExporting ? 'Exporting...' : 'Export Summary'}
                            </span>
                        </Button>
                        <Link to="/assessments/new">
                            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-xs">
                                <Plus className="w-4 h-4" />
                                <span>Create Assessment</span>
                            </Button>
                        </Link>
                    </>
                }
            />

            {/* ── Key Metrics ──────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="ACTIVE PUBLISHED"
                    value={String(publishedCount)}
                    subtext={`${publishedCount > 0 ? '+3 this term' : 'No new this term'}`}
                    trend={publishedCount > 0 ? { value: '+3 this term', positive: true } : undefined}
                    icon={<CheckCircle className="w-4 h-4" />}
                    iconColor="text-emerald-700"
                    iconBg="bg-emerald-50"
                    progressValue={publishedCount > 0 ? 96 : 0}
                    progressColor="text-emerald-600"
                />
                <MetricCard
                    title="PENDING SUBMISSIONS"
                    value="270"
                    subtext="across 4 cohorts"
                    icon={<AlertCircle className="w-4 h-4" />}
                    iconColor="text-slate-500"
                    iconBg="bg-slate-50"
                    progressValue={78}
                    progressColor="text-blue-600"
                />
                <MetricCard
                    title="OVERALL AVG SCORE"
                    value="76.4%"
                    subtext="+2.8%"
                    trend={{ value: '+2.8%', positive: true }}
                    icon={<BarChart3 className="w-4 h-4" />}
                    iconColor="text-emerald-700"
                    iconBg="bg-emerald-50"
                    progressValue={76}
                    progressColor="text-emerald-600"
                />
                <MetricCard
                    title="DRAFTS IN PROGRESS"
                    value={String(draftCount)}
                    subtext={`${draftCount > 0 ? '2 awaiting review' : 'No drafts'}`}
                    icon={<List className="w-4 h-4" />}
                    iconColor="text-slate-500"
                    iconBg="bg-slate-50"
                    progressValue={draftCount > 0 ? 30 : 0}
                    progressColor="text-slate-400"
                />
            </div>

            {/* ── Main Data Table Section ──────────────── */}
            <Card className="bg-white border-slate-200/80 shadow-xs">
                <CardContent className="p-0">
                    {/* Tabs */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-transparent p-0 h-auto gap-1">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className={cn(
                                            'px-3 py-1.5 text-xs font-semibold rounded-md transition-all data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 text-slate-600',
                                        )}
                                    >
                                        {tab.label}{' '}
                                        <span
                                            className={cn(
                                                'ml-1 text-[10px]',
                                                activeTab === tab.value ? 'text-emerald-700' : 'text-slate-400',
                                            )}
                                        >
                                            ({tab.count})
                                        </span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!someSelected}
                            className={cn(
                                'text-xs gap-1.5',
                                someSelected
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                    : 'text-slate-400 border-slate-200 cursor-not-allowed',
                            )}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Bulk Actions ({selectedAssessments.length})
                        </Button>
                    </div>

                    {/* Search & Sort Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-3 border-b border-slate-100">
                        <div className="relative flex-1 w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Filter by title, course code, or cohort..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 h-9 w-full sm:w-72 text-sm bg-white border border-slate-200 rounded-lg focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20 outline-none transition-all"
                            />
                        </div>
                        <Select value={courseFilter} onValueChange={setCourseFilter}>
                            <SelectTrigger className="h-9 w-[140px] text-xs border-slate-200">
                                <SelectValue placeholder="Course: All Courses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Course: All Courses</SelectItem>
                                <SelectItem value="CS">CS Courses</SelectItem>
                                <SelectItem value="SWE">SWE Courses</SelectItem>
                                <SelectItem value="MATH">MATH Courses</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-9 w-[140px] text-xs border-slate-200">
                                <SelectValue placeholder="Sort by: Recently Updated" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Sort by: Recently Updated</SelectItem>
                                <SelectItem value="name">Sort by: Name</SelectItem>
                                <SelectItem value="status">Sort by: Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    {paginatedItems.length === 0 ? (
                        <EmptyState
                            icon={<Inbox className="w-6 h-6 text-slate-400" />}
                            title="No assessments found"
                            description={
                                search || activeTab !== 'all' || courseFilter !== 'all'
                                    ? 'No assessments match your current filters. Try adjusting your search or filters.'
                                    : 'No assessments available yet. Create your first assessment to get started.'
                            }
                            actionLabel="Create Assessment"
                            onAction={() => navigate('/assessments/new')}
                            className="border-0 rounded-none bg-transparent py-12"
                        />
                    ) : (
                        <>
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-3 px-4">
                                            <Checkbox
                                                checked={allSelected}
                                                onCheckedChange={toggleSelectAll}
                                                className="h-4 w-4"
                                            />
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-left">
                                            ASSESSMENT DETAILS
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-left">
                                            STATUS
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-left">
                                            JOIN CODE
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-left">
                                            SUBMISSIONS
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-left">
                                            AVG SCORE
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">
                                            ACTIONS
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedItems.map((item) => {
                                        const isSelected = selectedAssessments.includes(item.id);
                                        const isPublishing = publishingId === item.id && publishMutation.isPending;
                                        return (
                                            <TableRow key={item.id} className="border-b border-slate-100 hover:bg-slate-50/40">
                                                <TableCell className="py-3 px-4">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleSelect(item.id)}
                                                        className="h-4 w-4"
                                                    />
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            <span className="font-mono">{item.joinCode}</span>
                                                            {' • '}{item.durationMinutes} Mins
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <StatusBadge status={item.status === 'published' ? 'PUBLISHED' : item.status === 'draft' ? 'DRAFT' : 'CLOSED'} />
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <span className={cn(
                                                        'text-sm font-mono font-semibold',
                                                        item.joinCode === 'Unassigned' ? 'text-slate-400' : 'text-slate-700',
                                                    )}>
                                                        {item.joinCode === 'Unassigned' ? 'Unassigned' : item.joinCode}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    {item.status === 'draft' ? (
                                                        <span className="text-sm text-slate-500">0 Submissions, Draft</span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-slate-700">
                                                                {item.title.includes('Database') ? '120/125' :
                                                                item.title.includes('Web Development') ? '86/90' :
                                                                item.title.includes('Operating') ? '64/64' :
                                                                item.title.includes('Discrete') ? '98/100' :
                                                                item.title.includes('Computer') ? '52/55' : '0/0'}
                                                            </span>
                                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full bg-emerald-500"
                                                                    style={{ width: `${item.title.includes('Database') ? 96 : item.title.includes('Web Development') ? 95 : item.title.includes('Operating') ? 100 : item.title.includes('Discrete') ? 98 : item.title.includes('Computer') ? 94 : 0}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-semibold text-emerald-600">
                                                                {item.title.includes('Database') ? '96%' :
                                                                item.title.includes('Web Development') ? '95%' :
                                                                item.title.includes('Operating') ? '100%' :
                                                                item.title.includes('Discrete') ? '98%' :
                                                                item.title.includes('Computer') ? '94%' : '0%'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <span className="text-sm font-semibold text-slate-900">
                                                        {item.title.includes('Database') ? '76%' :
                                                        item.title.includes('Web Development') ? '68%' :
                                                        item.title.includes('Algorithms') ? '—' :
                                                        item.title.includes('Operating') ? '82%' :
                                                        item.title.includes('Discrete') ? '74%' :
                                                        '79%'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {/* View */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-2 text-xs gap-1 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300"
                                                            onClick={() => handleView(item.id)}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            <span className="hidden sm:inline">{item.status === 'draft' ? 'View' : 'Manage'}</span>
                                                        </Button>

                                                        {/* Edit */}
                                                        {item.status === 'draft' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs gap-1 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300"
                                                                onClick={() => navigate(`/assessments/${item.id}/edit`)}
                                                            >
                                                                <Edit3 className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Edit Draft</span>
                                                            </Button>
                                                        )}

                                                        {/* Publish */}
                                                        {item.status === 'draft' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="h-7 w-7"
                                                                onClick={() => handlePublish(item.id)}
                                                                title="Publish"
                                                                disabled={isPublishing}
                                                            >
                                                                {isPublishing ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                                                                ) : (
                                                                    <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                                                                )}
                                                            </Button>
                                                        )}

                                                        {/* Analytics */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="h-7 w-7"
                                                            onClick={() => handleViewAnalytics(item.id)}
                                                        >
                                                            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                                                        </Button>

                                                        {/* Delete */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="h-7 w-7"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500">
                                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} assessments
                                    </span>
                                    {isRefetching && (
                                        <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0 border-slate-200"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </Button>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <Button
                                            key={i}
                                            variant={currentPage === i + 1 ? 'default' : 'outline'}
                                            size="sm"
                                            className={cn(
                                                'h-7 w-7 p-0 text-xs',
                                                currentPage === i + 1
                                                    ? 'bg-emerald-700 border-emerald-700'
                                                    : 'border-slate-200',
                                            )}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0 border-slate-200"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* ── Bottom Section - Insights ────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-white border-slate-200/80 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Submission Pacing</h3>
                                <p className="text-xs text-slate-500">Last 7 days response volume</p>
                            </div>
                        </div>
                        <SubmissionPacingChart />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">Peak: Wednesday (89 completions)</span>
                            <span className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer">
                                View detailed metrics
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200/80 shadow-xs">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Integrity & Proctoring</h3>
                                <p className="text-xs text-slate-500">Automated flagging across 6 cohorts</p>
                            </div>
                        </div>
                        <IntegrityDonutChart />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">No flags raised this term</span>
                            <span className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer">
                                View detailed metrics
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Delete Confirmation Dialog ───────────── */}
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Assessment"
                description="Are you sure you want to delete this assessment? This action cannot be undone and all associated data will be permanently removed."
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}