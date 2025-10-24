import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Popular Categories */}
        <div className="footer-section">
          <h4>Popular Categories</h4>
          <ul>
            <li>Cars</li>
            <li>Flats for rent</li>
            <li>Mobile Phones</li>
            <li>Jobs</li>
          </ul>
        </div>

        {/* Trending Searches */}
        <div className="footer-section">
          <h4>Trending Searches</h4>
          <ul>
            <li>Bikes</li>
            <li>Watches</li>
            <li>Books</li>
            <li>Dogs</li>
          </ul>
        </div>

        {/* About Us */}
        <div className="footer-section">
          <h4>About Us</h4>
          <ul>
            <li>About Dubizzle Group</li>
            <li>OLX Blog</li>
            <li>Contact Us</li>
            <li>OLX for Businesses</li>
          </ul>
        </div>

        {/* OLX */}
        <div className="footer-section">
          <h4>OLX</h4>
          <ul>
            <li>Help</li>
            <li>Sitemap</li>
            <li>Terms of use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="footer-section follow-us">
  <h4>Follow Us</h4>
  <div className="social-icons">
    <a href="#" className="icon-circle">X</a>   
    <a href="#" className="icon-circle">f</a>   
    <a href="#" className="icon-circle">▶</a>   
    <a href="#" className="icon-circle">⌂</a>   
  </div>
</div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 OLX Clone. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
