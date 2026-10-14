(() => {
    const STORAGE_KEY = "bookTracker.books";
    const COVER_COUNT = 8;
    const statusLabels = {
        "to-read": { label: "To read", className: "want-to-read" },
        reading: { label: "Reading", className: "reading" },
        finished: { label: "Finished", className: "" }
    };
    const bookGrid = document.querySelector(".book-grid");
    const searchInput = document.querySelector("#book-search");
    const resultCount = document.querySelector("#search-results");
    const bookCount = document.querySelector("#book-count");
    const finishedCount = document.querySelector("#finished-count");
    const remainingCount = document.querySelector("#remaining-count");
    const shelfCount = document.querySelector("#shelf-count");
    const emptyState = document.querySelector(".empty-state");
    const libraryError = document.querySelector("#library-error");
    const statusOrder = ["to-read", "reading", "finished"];

    if (!(bookGrid instanceof HTMLElement) || !(emptyState instanceof HTMLElement)) {
        return;
    }

    let books;
    try {
        const storedBooks = localStorage.getItem(STORAGE_KEY);
        const parsedBooks = storedBooks === null ? [] : JSON.parse(storedBooks);
        if (!Array.isArray(parsedBooks)) {
            throw new Error("Saved bookshelf data is invalid.");
        }

        books = parsedBooks.map((book) => {
            if (
                typeof book !== "object" ||
                book === null ||
                typeof book.title !== "string" ||
                typeof book.author !== "string" ||
                typeof book.status !== "string" ||
                !Object.prototype.hasOwnProperty.call(statusLabels, book.status) ||
                !Number.isInteger(book.coverIndex) ||
                book.coverIndex < 0 ||
                book.coverIndex >= COVER_COUNT
            ) {
                throw new Error("A saved book has invalid data.");
            }
            return book;
        });
    } catch (error) {
        console.error("Unable to load books from browser storage.", error);
        if (libraryError instanceof HTMLElement) {
            libraryError.hidden = false;
            libraryError.textContent = "Books could not be loaded from browser storage.";
        }
        return;
    }

    let searchableBooks = [];

    for (const book of books) {
        const card = document.createElement("article");
        card.className = "book-card";

        const cover = document.createElement("div");
        cover.className = `cover cover-${book.coverIndex + 1}`;
        cover.setAttribute("role", "img");
        cover.setAttribute("aria-label", `Color cover for ${book.title} by ${book.author}`);

        const coverKicker = document.createElement("span");
        coverKicker.className = "cover-kicker";
        coverKicker.textContent = "In your library";

        const coverTitle = document.createElement("p");
        coverTitle.className = "cover-title";
        coverTitle.textContent = book.title;

        const coverAuthor = document.createElement("span");
        coverAuthor.className = "cover-author";
        coverAuthor.textContent = book.author;
        cover.append(coverKicker, coverTitle, coverAuthor);

        const meta = document.createElement("div");
        meta.className = "book-meta";
        const title = document.createElement("h2");
        title.className = "book-title";
        title.textContent = book.title;
        meta.append(title);

        const author = document.createElement("p");
        author.className = "book-author";
        author.textContent = book.author;

        const details = document.createElement("div");
        details.className = "book-details";
        const statusButton = document.createElement("button");
        statusButton.type = "button";
        statusButton.className = "status status-button";

        const updateStatusButton = () => {
            const statusDetails = statusLabels[book.status];
            const nextStatus = statusOrder[statusOrder.indexOf(book.status) + 1];
            statusButton.className = `status status-button ${statusDetails.className}`.trim();
            statusButton.textContent = statusDetails.label;
            statusButton.disabled = nextStatus === undefined;
            statusButton.setAttribute(
                "aria-label",
                nextStatus
                    ? `Advance ${book.title} from ${statusDetails.label} to ${statusLabels[nextStatus].label}`
                    : `${book.title} is finished`
            );
        };
        updateStatusButton();

        statusButton.addEventListener("click", () => {
            const currentIndex = statusOrder.indexOf(book.status);
            const nextStatus = statusOrder[currentIndex + 1];
            if (!nextStatus) return;

            const updatedBooks = books.map((savedBook, index) =>
                savedBook === book ? { ...savedBook, status: nextStatus } : savedBook
            );

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
                book.status = nextStatus;
                updateStatusButton();
                updateBookCounts();
                if (libraryError instanceof HTMLElement) {
                    libraryError.hidden = true;
                    libraryError.textContent = "";
                }
            } catch (error) {
                console.error("Unable to update book status in browser storage.", error);
                if (libraryError instanceof HTMLElement) {
                    libraryError.hidden = false;
                    libraryError.textContent = "Book status could not be saved. Check browser storage and try again.";
                }
            }
        });

        const actions = document.createElement("div");
        actions.className = "book-actions";
        actions.append(statusButton);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${book.title}`);
        deleteButton.addEventListener("click", () => {
            const updatedBooks = books.filter((savedBook) => savedBook !== book);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
                books = updatedBooks;
                searchableBooks = searchableBooks.filter((searchableBook) => searchableBook.card !== card);
                card.remove();
                updateBookCounts();
                updateSearchView();
                if (libraryError instanceof HTMLElement) {
                    libraryError.hidden = true;
                    libraryError.textContent = "";
                }
            } catch (error) {
                console.error("Unable to delete the book from browser storage.", error);
                if (libraryError instanceof HTMLElement) {
                    libraryError.hidden = false;
                    libraryError.textContent = "The book could not be deleted. Check browser storage and try again.";
                }
            }
        });
        actions.append(deleteButton);
        details.append(actions);

        card.append(cover, meta, author, details);
        bookGrid.append(card);
    }

    const bookCards = Array.from(bookGrid.querySelectorAll(".book-card"));
    searchableBooks = bookCards.map((card) => ({
        card,
        text: Array.from(card.querySelectorAll(".book-title, .book-author"))
            .map((element) => element.textContent ?? "")
            .join(" ")
            .toLocaleLowerCase()
    }));

    function updateBookCounts() {
        const totalBooks = books.length;
        const finishedBooks = books.filter((book) => book.status === "finished").length;
        const remainingBooks = totalBooks - finishedBooks;

        if (bookCount instanceof HTMLElement) {
            bookCount.textContent = `${totalBooks} ${totalBooks === 1 ? "book" : "books"}`;
        }
        if (finishedCount instanceof HTMLElement) {
            finishedCount.textContent = String(finishedBooks);
        }
        if (remainingCount instanceof HTMLElement) {
            remainingCount.textContent = String(remainingBooks);
        }
        if (shelfCount instanceof HTMLElement) {
            shelfCount.textContent = String(totalBooks).padStart(2, "0");
        }
    }

    function updateSearchView() {
        const query = searchInput instanceof HTMLInputElement
            ? searchInput.value.trim().toLocaleLowerCase()
            : "";
        let visibleCount = 0;

        for (const book of searchableBooks) {
            const matches = book.text.includes(query);
            book.card.hidden = !matches;
            if (matches) visibleCount += 1;
        }

        emptyState.hidden = visibleCount > 0;
        if (books.length > 0 && visibleCount === 0) {
            emptyState.textContent = "No books match your search.";
        } else {
            emptyState.textContent = "Your bookshelf is empty. Add your first book to get started.";
        }

        if (resultCount instanceof HTMLElement) {
            resultCount.textContent = query
                ? `${visibleCount} ${visibleCount === 1 ? "book" : "books"} found`
                : `Showing ${visibleCount} ${visibleCount === 1 ? "book" : "books"}`;
        }
    }

    updateBookCounts();
    updateSearchView();

    if (searchInput instanceof HTMLInputElement) {
        searchInput.addEventListener("input", updateSearchView);
    }
})();