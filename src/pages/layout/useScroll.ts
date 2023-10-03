import { useEffect } from "react";
import { useSearchParams, useNavigationType, useLocation } from "react-router-dom";
import { animateScroll as scroll, scroller } from 'react-scroll'

export default function useScroll() {

    const location = useLocation();
    const searchParams = useSearchParams()[0];
    const action = useNavigationType();

    useEffect(() => {
        const scrollTo = searchParams.get("scrollTo");
        const scrollOffset = searchParams.get("scrollOffset");

        if (action !== "POP") {
            if (scrollTo) {
                scroller.scrollTo(scrollTo, {
                    duration: 1000,
                    delay: 0,
                    smooth: true,
                    offset: parseInt(scrollOffset ? scrollOffset:"", 10)
                })
            }
            else scroll.scrollToTop({
                duration: 1,
                delay: 0,
                smooth: false,
            });
        }
    }, [action, location]);

}