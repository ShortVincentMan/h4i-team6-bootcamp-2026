export default function Contact() {
  return (
    <main className="page-container">
      <h1 className="page-title">Drop Us a Line</h1>

      <div className="content-card">
        <p style={{ marginBottom: "2rem", textAlign: "center" }}>
          Have a question or a vintage find to donate? Send us a message!
        </p>

        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" className="form-input" placeholder="Your name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" className="form-input" placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="form-input"
              placeholder="What's on your mind?"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
