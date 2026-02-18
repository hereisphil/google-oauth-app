const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 text-center">
            <p>
                &copy; {new Date().getFullYear()} Google OAuth App. All rights
                reserved.
            </p>
            <p className="text-sm mt-2">
                Built by{" "}
                <a
                    href="https://github.com/hereisphil"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    hereisphil
                </a>
                .
            </p>
        </footer>
    );
};

export default Footer;
