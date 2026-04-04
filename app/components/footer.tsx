export default function header() {
    return (
        <footer className="bg-gray-800 text-white py-0">
            <div className="max-w-4xl mx-auto px-4 text-center text-sm">
                &copy; {new Date().getFullYear()} Documents
            </div>
        </footer>
    )
}
