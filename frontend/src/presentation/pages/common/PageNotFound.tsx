import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const PageNotFound = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const isAdminRoute =
        location.pathname.startsWith("/admin");

    const homePath =
        isAdminRoute
            ? "/admin/dashboard"
            : "/dashboard";

    const handleGoHome = () => {
        navigate(homePath);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

            <div className="w-full max-w-lg text-center">

                {/* Animated 404 illustration */}

                <div className="mx-auto mb-8 flex h-32 w-32 items-end justify-center">

                    <div className="relative h-28 w-28 overflow-hidden border-b-2 border-slate-800">

                        {/* Bouncing ball */}

                        <div
                            className="
                                absolute
                                bottom-0
                                left-1/2
                                h-10
                                w-10
                                -translate-x-1/2
                                rounded-full
                                bg-gradient-to-br
                                from-red-500
                                to-rose-600
                                shadow-lg
                                animate-[notFoundBounce_1s_ease-in-out_infinite_alternate]
                            "
                        />

                        {/* Pebbles */}

                        <div
                            className="
                                absolute
                                top-[94%]
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-slate-700
                                animate-[pebbleMove_1.5s_linear_infinite]
                            "
                        />

                        <div
                            className="
                                absolute
                                top-[97%]
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-slate-600
                                animate-[pebbleMove_2s_linear_infinite]
                            "
                        />

                        <div
                            className="
                                absolute
                                top-[98%]
                                h-1
                                w-1
                                rounded-full
                                bg-slate-500
                                animate-[pebbleMove_2.5s_linear_infinite]
                            "
                        />

                    </div>

                </div>

                {/* 404 */}

                <p className="text-7xl font-extrabold tracking-tight text-slate-900">
                    404
                </p>

                <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Page Not Found
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                    Sorry, we couldn't find the page you're looking for.
                    It may have been moved, deleted, or the URL may be incorrect.
                </p>

                {/* Navigation */}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            transition
                            hover:bg-slate-100
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-300
                            focus:ring-offset-2
                        "
                    >
                        <ArrowLeft size={17} />

                        Go Back
                    </button>

                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-gradient-to-r
                            from-red-500
                            to-rose-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-md
                            shadow-red-200
                            transition
                            hover:scale-[1.02]
                            hover:shadow-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-300
                            focus:ring-offset-2
                            active:scale-[0.98]
                        "
                    >
                        <Home size={17} />

                        {isAdminRoute
                            ? "Back to Admin Dashboard"
                            : "Back to Dashboard"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default PageNotFound;