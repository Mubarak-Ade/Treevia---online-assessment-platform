import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function HomeCtaSection() {
    return (
        <section className="py-20 bg-emerald-800 text-white text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Ready to create your first assessment?
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto pb-4">
                    Join thousands of educators delivering better learning experiences with Treevia.
                </p>
                <div>
                    <Link to="/register">
                        <Button
                            size="lg"
                            className="h-11 px-7 bg-white text-emerald-900 hover:bg-emerald-50 font-semibold rounded-md shadow-md text-sm"
                        >
                            Get Started for Free
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
