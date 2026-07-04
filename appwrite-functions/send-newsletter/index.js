const sdk = require('node-appwrite');
const nodemailer = require('nodemailer');

/*
  APPWRITE FUNCTION: Send Newsletter
  This function should be triggered by:
  databases.[YOUR_DB_ID].collections.[YOUR_POSTS_COLLECTION_ID].documents.*.create

  Required Environment Variables in your Appwrite Function settings:
  - APPWRITE_API_KEY (Needs database read access)
  - SMTP_HOST (e.g. smtp.sendgrid.net)
  - SMTP_PORT (e.g. 587)
  - SMTP_USER (e.g. apikey)
  - SMTP_PASS (your smtp password)
  - FROM_EMAIL (e.g. noreply@storynest.com)
*/

module.exports = async function ({ req, res, log, error }) {
  if (!process.env.APPWRITE_FUNCTION_PROJECT_ID) {
    return res.json({ success: false, message: 'Missing project ID' });
  }

  // The new post data will be in req.bodyRaw or req.body depending on Appwrite version
  const eventData = req.bodyRaw ? JSON.parse(req.bodyRaw) : req.body;
  
  if (!eventData || !eventData.title) {
    return res.json({ success: false, message: 'No post data found' });
  }

  log(`New post created: ${eventData.title}. Fetching subscribers...`);

  // Initialize Appwrite Client
  const client = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  try {
    // 1. Fetch all subscribers
    const subscribers = await databases.listDocuments(
      process.env.VITE_APPWRITE_DATABASE_ID, 
      process.env.VITE_APPWRITE_SUBSCRIBERS_COLLECTION_ID 
    );

    if (subscribers.total === 0) {
      log('No subscribers found. Skipping email.');
      return res.json({ success: true, message: 'No subscribers' });
    }

    // 2. Configure NodeMailer to send emails
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emails = subscribers.documents.map(sub => sub.email);
    log(`Sending emails to ${emails.length} subscribers...`);

    // 3. Send the email
    await transporter.sendMail({
      from: `"StoryNest" <${process.env.FROM_EMAIL}>`,
      bcc: emails.join(', '), 
      subject: `New Story on StoryNest: ${eventData.title}`,
      text: `A new story titled "${eventData.title}" was just published on StoryNest! Log in to read it now.`,
      html: `
        <h2>A new story was just published on StoryNest!</h2>
        <p><strong>Title:</strong> ${eventData.title}</p>
        <p>Log in to StoryNest to read it now!</p>
      `,
    });

    log('Emails sent successfully!');
    return res.json({ success: true });

  } catch (err) {
    error(`Failed to send newsletter: ${err.message}`);
    return res.json({ success: false, error: err.message });
  }
};
