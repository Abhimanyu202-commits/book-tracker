(() => {
    const STORAGE_KEY = "bookTracker.books";
    const COVER_COUNT = 8;
    const allowedStatuses = new Set(["to-read", "reading", "finished"]);
    const form = document.querySelector(".book-form");
    const errorMessage = document.querySelector("#form-error");

    if (!(form instanceof HTMLFormElement) || !(errorMessage instanceof HTMLElement)) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        errorMessage.textContent = "";

        const formData = new FormData(form);
        const title = String(formData.get("title") ?? "").trim();
        const author = String(formData.get("author") ?? "").trim();
        const status = String(formData.get("status") ?? "");

        if (author && !/^[\p{L}\p{M}\s'-]+$/u.test(author)) {
            window.alert("Author name can only contain letters, spaces, hyphens, or apostrophes.");
            document.querySelector("#book-author")?.focus();
            return;
        }

        if (title.length > 39) {
            errorMessage.textContent = "Book title must be 39 characters or fewer.";
            return;
        }

        if (!title || !author || !allowedStatuses.has(status)) {
            errorMessage.textContent = "Enter a title and author, then choose a valid status.";
            return;
        }

        try {
            const storedBooks = localStorage.getItem(STORAGE_KEY);
            const books = storedBooks === null ? [] : JSON.parse(storedBooks);

            if (!Array.isArray(books)) {
                throw new Error("Saved bookshelf data is invalid.");
            }

            const book = {
                title,
                author,
                status,
                coverIndex: Math.floor(Math.random() * COVER_COUNT)
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify([book, ...books]));
            window.location.assign("index.html");
        } catch (error) {
            console.error("Unable to save the book to browser storage.", error);
            errorMessage.textContent = "The book could not be saved. Check that browser storage is available and try again.";
        }
    });
})();