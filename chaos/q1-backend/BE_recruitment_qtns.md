1.  Identify one problem in the below code block, will this code compile? Discuss the related Rust feature regarding the problem you have identified, why does Rust choose to include this feature? A few sentences are good enough.

    ```rust
        let data = vec![1, 2, 3];
        let my_ref_cell = RefCell::new(69);
        let ref_to_ref_cell = &my_ref_cell;

        std::thread::spawn(move || {

            println!("captured {data:?} by value");

            println!("Whats in the cell?? {ref_to_ref_cell:?}")

        }).join().unwrap();
    ```

    A: This code does not compile due to ref_to_ref_cell borrowing my_ref_cell and thereafter being used within a separate spawned thread. This defies Rust's borrowing rules on references, which cannot be used in a multithreaded context, only single threads.
    
    For disclosure, I needed to first compile this code, then discover the compile error, and only then answer this question after reading the [docs](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html).

2.  Shortly discuss, when modelling a response to a HTTP request in Rust, would you prefer to use `Option` or `Result`?

    A: I would use a `Result` for HTTP responses. Due to the variety of error status codes (404, 500, etc.), the `Err` variant in a `Result` is more suited to handle these scenarios than the `Some` variant in an `Option`. This additionally follows HTTP responses' format of having a single `Ok` variant (status 200) instead of an ambiguous `Some` variant.

3.  In `student.psv` there are some fake student datas from UNSW CSE (no doxx!). In each row, the fields from left to right are

    - UNSW Course Code
    - UNSW Student Number
    - Name
    - UNSW Program
    - UNSW Plan
    - WAM
    - UNSW Session
    - Birthdate
    - Sex

    Write a Rust program to find the course which has the highest average student WAM. **Write your program in the cargo project q3**.

    A: Completed. This was a really tough challenge, as there is still much more to learn in Rust - but breaking down the problem assisted greatly in thinking about the next step. The code could definitely be made cleaner - I could have separated much of the code into their own functions, but I was unsure of their signatures. Overall, fantastic challenge. Thanks!

    References:
        1. [PathBuf](https://doc.rust-lang.org/std/path/struct.PathBuf.html)
        2. [csv Crate](https://docs.rs/csv/latest/csv/tutorial/index.html)
        3. [csv ReaderBuilder](https://docs.rs/csv/latest/csv/struct.ReaderBuilder.html)
        4. [HashMap example](https://doc.rust-lang.org/std/collections/struct.HashMap.html)
        5. [HashMap snippets](https://doc.rust-lang.org/book/ch08-03-hash-maps.html)
