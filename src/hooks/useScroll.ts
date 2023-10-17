import { useEffect } from "react";
import { useSearchParams, useNavigationType, useLocation } from "react-router-dom";
import { animateScroll as scroll, scroller } from 'react-scroll'

export default function useScroll(hasSideBar: boolean) {

    const location = useLocation();
    const searchParams = useSearchParams()[0];
    const action = useNavigationType();

    useEffect(() => {
        const scrollTo = searchParams.get("scrollTo");
        const scrollOffset = searchParams.get("scrollOffset");
        if (scrollTo) {
            scroller.scrollTo(scrollTo, {
                duration: 1000,
                delay: 100,
                smooth: true,
                offset: parseInt(scrollOffset ? scrollOffset:"", 10)
            })
        } else if (action === "REPLACE") {
            if (hasSideBar) {
                scroll.scrollMore(0.5, {
                duration: 1,
                delay: 200,
                smooth: false,
            });
            scroll.scrollToTop({
                duration: 400,
                delay: 200,
                smooth: true,
            })
        } else {
            scroll.scrollToTop({
                duration: 400,
                delay: 0,
                smooth: true,
            })
        }

        } else scroll.scrollToTop({
            duration: 1,
            delay: 0,
            smooth: false,
        });
    }, [location.key]);

}