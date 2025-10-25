export default function Footer() {
  return (
    <footer className="footer mt-5">
      <div className="container py-4 d-flex flex-wrap justify-content-between align-items-center">
        <div className="small">© {new Date().getFullYear()} Pizza Hub. All rights reserved.</div>
        <div className="d-flex gap-3 small">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
