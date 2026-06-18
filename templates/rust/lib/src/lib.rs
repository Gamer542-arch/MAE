/// A collection of string utility functions for the `{name}` library.
///
/// # Example
///
/// ```
/// use {name}::StringExt;
///
/// assert_eq!("hello_world".to_title_case(), "Hello_World");
/// ```

pub trait StringExt {
    /// Converts a string to title case for each word separated by underscores.
    fn to_title_case(&self) -> String;

    /// Checks if a string is a valid email address (simple check).
    fn is_valid_email(&self) -> bool;

    /// Truncates a string to a given length, appending "..." if truncated.
    fn truncate(&self, max_len: usize) -> String;
}

impl StringExt for str {
    fn to_title_case(&self) -> String {
        self.split('_')
            .filter(|s| !s.is_empty())
            .map(|word| {
                let mut chars = word.chars();
                match chars.next() {
                    None => String::new(),
                    Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
                }
            })
            .collect::<Vec<_>>()
            .join("_")
    }

    fn is_valid_email(&self) -> bool {
        let trimmed = self.trim();
        if trimmed.is_empty() {
            return false;
        }
        let at_pos = trimmed.find('@');
        if let Some(pos) = at_pos {
            pos > 0 && pos < trimmed.len() - 1 && trimmed[pos + 1..].contains('.')
        } else {
            false
        }
    }

    fn truncate(&self, max_len: usize) -> String {
        if self.len() <= max_len {
            self.to_string()
        } else {
            format!("{}...", &self[..max_len.saturating_sub(3)])
        }
    }
}

/// Computes the nth Fibonacci number iteratively.
///
/// # Example
///
/// ```
/// use {name}::fibonacci;
///
/// assert_eq!(fibonacci(0), 0);
/// assert_eq!(fibonacci(1), 1);
/// assert_eq!(fibonacci(10), 55);
/// ```
pub fn fibonacci(n: u64) -> u64 {
    if n == 0 {
        return 0;
    }
    let mut a = 0;
    let mut b = 1;
    for _ in 1..n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_to_title_case() {
        assert_eq!("hello_world".to_title_case(), "Hello_World");
        assert_eq!("foo_bar_baz".to_title_case(), "Foo_Bar_Baz");
        assert_eq!("single".to_title_case(), "Single");
        assert_eq!("".to_title_case(), "");
    }

    #[test]
    fn test_is_valid_email() {
        assert!("user@example.com".is_valid_email());
        assert!("a@b.co".is_valid_email());
        assert!(!"".is_valid_email());
        assert!(!"notanemail".is_valid_email());
        assert!(!"@domain.com".is_valid_email());
        assert!(!"user@".is_valid_email());
    }

    #[test]
    fn test_truncate() {
        assert_eq!("hello".truncate(10), "hello");
        assert_eq!("hello world".truncate(10), "hello w...");
        assert_eq!("hello world".truncate(5), "...");
    }

    #[test]
    fn test_fibonacci() {
        assert_eq!(fibonacci(0), 0);
        assert_eq!(fibonacci(1), 1);
        assert_eq!(fibonacci(2), 1);
        assert_eq!(fibonacci(10), 55);
        assert_eq!(fibonacci(20), 6765);
    }
}
