prompt1: create a grid layout for listing book , use index.html
what happened: created a grid lay out consisiting 4 boxes in a row,wasnt mobile screen responsive !
at first it was using internal css

prompt: instead of internal css use external css file "style.css"
what happened:css switched from internal to external file

prompt2 : on smartphone screen , one row should only contain 2 books
what happened: Made the smartphone layout explicitly use 2 books per row at widths up to 700px. Updated 


prompt3 : create a search option above the grid container
what happened : Added a search field directly above the book grid. It filters books as you type by title or author and updates the result count. The field is styled for desktop and mobile, and the JavaScript syntax check passed.

prompt4 :create a form inside add-book.html with Title, Author and a Status dropdown (To read, Reading, Finished).
what happened :Created the form in add-book.html with required Title and Author fields and a Status dropdown offering To read, Reading, and Finished. Added responsive styling in add-book.css.
The form is currently presentation-only; submitting it does not save a book to the bookshel

prompt5:create a link add book which redirects user to the add-book.html form , after successfull form submition , user has to be redirected back to index.html
what happened : Added an Add a book link to the bookshelf header. After a valid form submission, the browser returns to index.html and displays the submitted book with its selected status; the book and shelf counts update as well. Search also includes the new book

prompt6:remove all the dummy data from scripts.js
what happened:Removed the temporary book-card generation from scripts.js. Search and book counts still work, and the JavaScript syntax check passed.
The sample books are still listed directly in index.html; they were not in scripts.js. Also, submitting the add-book form now redirects to the bookshelf but does not save or display the submitted book.

prompt7:remove those sample books as well
what happened:Removed the sample books from index.html, reset the visible counts to zero, and added an empty-shelf message. Confirmed there are no remaining sample book entries, and the bookshelf script still passes its syntax check.

prompt8:when add-book.html form is submitted , store that data in local storage ( browser storage ) and display those in index.html,for now coverpage of book is not required , add some random color as cover page
what happened:Book submissions now save the title, author, status, and a randomly selected cover color to browser localStorage, then redirect to the bookshelf. The bookshelf loads saved books, updates its counts, and filters them with the existing search. Storage errors are shown instead of silently failing.
Updated add-book.js, scripts.js, add-book.html, index.html, add-book.css, and style.css. Both JavaScript files passed syntax checks.

prompt9:book status has to be changed from to read to reading from there to finished , delete book feature
what happened:Book status can now be advanced by clicking its badge on the bookshelf: To read → Reading → Finished. Each change is saved to localStorage, so it persists after reload. The Finished badge is disabled because it’s the last step. JavaScript syntax validation passed.

prompt10:show how many books are finished,how many are left to finsish ,add this along with book count
what happened:Added finished and left to finish counts beside the total book count in the bookshelf header. The counts update when a book’s status advances or it’s deleted. JavaScript syntax validation passed.
