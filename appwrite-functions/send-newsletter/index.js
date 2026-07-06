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
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://tor.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new sdk.Databases(client);

  try {
    // 1. Fetch all subscribers
    const databaseId = (process.env.VITE_APPWRITE_DATABASE_ID || '69491b4400252d0c1973').replace(/['"]/g, '').trim();
    const collectionId = (process.env.VITE_APPWRITE_SUBSCRIBERS_COLLECTION_ID || 'subscribers').replace(/['"]/g, '').trim();

    const subscribers = await databases.listDocuments(
      databaseId,
      collectionId
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
    const siteUrl = process.env.VITE_SITE_URL || 'https://storynest-xi.vercel.app';
    const postUrl = eventData.$id ? `${siteUrl}/post/${eventData.$id}` : siteUrl;

    await transporter.sendMail({
      from: `"StoryNest" <${process.env.FROM_EMAIL}>`,
      bcc: emails.join(', '),
      subject: `New Story: ${eventData.title} | StoryNest`,
      text: `A new story titled "${eventData.title}" was just published on StoryNest!\n\nRead it here: ${postUrl}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background-color: rgb(23, 15, 52); padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
            .content h2 { color: #0f172a; margin-top: 0; font-size: 22px; }
            .story-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px 20px; margin: 30px 0; text-align: center; }
            .story-title { font-size: 20px; font-weight: bold; color: #0f172a; margin: 0 0 15px 0; }
            .btn { display: inline-block; background-color: rgb(23, 15, 52); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-top: 10px; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header" style="text-align: center;">
              <img src="${siteUrl}/LOGO.png" alt="StoryNest Logo" style="height: 140px; width: auto; max-width: 100%; display: inline-block; vertical-align: middle; pointer-events: none; user-select: none;">
            </div>
            <div class="content">
              <h2>A new story is waiting for you!</h2>
              <p>Hello there,</p>
              <p>We're excited to let you know that a brand new story has just been published on StoryNest. Dive in and discover what's new!</p>
              
              <div class="story-card">
                <h3 class="story-title">${eventData.title}</h3>
                <p style="margin-bottom: 25px; color: #64748b; font-size: 15px;">Read the full story by clicking the button below.</p>
                <a href="${postUrl}" class="btn">Read Story Now</a>
              </div>
              
              <p>Happy reading,<br>The StoryNest Team</p>
            </div>
            <div class="footer">
              <p>You received this email because you are subscribed to the StoryNest newsletter.</p>
              <p>&copy; ${new Date().getFullYear()} StoryNest. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    log('Emails sent successfully!');
    return res.json({ success: true });

  } catch (err) {
    error(`Failed to send newsletter: ${err.message}`);
    return res.json({ success: false, error: err.message });
  }
};
