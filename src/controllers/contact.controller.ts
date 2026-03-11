import { Request, Response } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, message } = req.body as {
      email: string;
      message: string;
    };

    if (!email || !message) {
      res.status(400).json({
        success: false,
        message: "Email and message required",
      });
      return;
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL as string,
      subject: "Portfolio Contact Message",
      html: `
        <h3>New message from portfolio</h3>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
