"use client";

/* ****************************************************
 *  import
 * ****************************************************/
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* ****************************************************
 *  function RedirectAfterDelay
 * ****************************************************/
export default function RedirectAfterDelay() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/index");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>3秒後に移動します...</h1>
        </div>
    );
}