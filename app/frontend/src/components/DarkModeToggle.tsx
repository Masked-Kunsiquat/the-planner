import { useEffect } from "react";

const DarkModeToggle = () => {
    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {

            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <button onClick={() => {
            document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme",

            document.documentElement.classList.contains("dark") ? "dark" : "light");
        }}
        className="text-gray-900 dark:text-white">Moon
        </button>
    );
};
export default DarkModeToggle;