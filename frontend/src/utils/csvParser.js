import Papa from 'papaparse';
import { validateRecipient } from './validators';

// Match common column header variations
const NAME_HEADERS = ['name', 'fullname', 'full_name', 'recipient', 'recipientname', 'recipient_name', 'student_name', 'participant'];
const EMAIL_HEADERS = ['email', 'emailaddress', 'email_address', 'mail', 'e_mail'];

export const parseRecipientsCsv = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim().toLowerCase().replace(/[\s_-]+/g, ''),
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          return reject(new Error('The uploaded CSV file is empty.'));
        }

        const fields = results.meta.fields || [];
        const nameField = fields.find((f) => NAME_HEADERS.includes(f));
        const emailField = fields.find((f) => EMAIL_HEADERS.includes(f));

        if (!nameField || !emailField) {
          return reject(
            new Error(
              'Could not find required columns. Please ensure your CSV has "Name" and "Email" columns.'
            )
          );
        }

        const parsed = results.data.map((row, index) => {
          const rawName = (row[nameField] || '').trim();
          const rawEmail = (row[emailField] || '').trim();
          const validation = validateRecipient({ name: rawName, email: rawEmail });

          return {
            id: `csv-${index}-${Date.now()}`,
            name: rawName,
            email: rawEmail,
            isValid: validation.isValid,
            nameError: validation.nameError,
            emailError: validation.emailError,
          };
        });

        resolve({
          recipients: parsed,
          totalRows: parsed.length,
          validCount: parsed.filter((r) => r.isValid).length,
          invalidCount: parsed.filter((r) => !r.isValid).length,
        });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      },
    });
  });
};

export const downloadSampleCsv = () => {
  const sampleData = `Name,Email\nPriyanshi Sharma,priyanshi@example.com\nRahul Verma,rahul.verma@example.com\nAnanya Patel,ananya.patel@example.com\nVikram Singh,vikram.singh@example.com`;
  const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'certigen_sample_recipients.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
