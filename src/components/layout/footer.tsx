export function Footer() {
    return (
      <footer className="mt-auto border-t">
        <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} GrantMatch. All rights reserved.</p>
        </div>
      </footer>
    );
}
