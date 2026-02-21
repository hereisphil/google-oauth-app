import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Design inspired by the National Design Studio https://ndstudio.gov

export function Home() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main>
            <section className="min-h-[85vh] flex items-center justify-center">
                <div className="flex flex-col gap-6 md:gap-12 items-center text-center max-w-90.25 md:max-w-266.5 mx-auto px-16 md:px-24">
                    <h1 className="font-pp-neue-montreal font-bold uppercase text-black text-[42px] leading-[0.85] md:text-[56px] lg:text-[72px]">
                        <span
                            className={`block transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            Keep track of people,
                        </span>
                        <span
                            className={`block transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            conversations, and opportunities,
                        </span>
                        <span
                            className={`block transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            without the clutter.
                        </span>
                    </h1>
                    <p
                        className={`font-pp-neue-montreal font-normal text-14 leading-6 md:text-16 transition-all duration-700 delay-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        A simple tool for freelancers and independent workers to
                        stay organized and follow up on time.
                    </p>
                    <Button size="xl" onClick={() => navigate("/login")}>
                        Start organizing today →
                    </Button>
                </div>
            </section>
        </main>
    );
}
