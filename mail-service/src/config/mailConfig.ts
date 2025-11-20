import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
console.log("env", process.env.BREVO_API_KEY);

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

export default apiInstance;
