import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

export const generateReceipt = async (
  student: any,
  payment: any,
): Promise<string> => {
  const htmlContent = `
    <h1 style="text-align: center; color: #2E86DE;">Library Payment Receipt</h1>
    <hr />
    <p><strong>Receipt No:</strong> ${payment._id}</p>
    <p><strong>Student Name:</strong> ${student.name}</p>
    <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
    <p><strong>Paid Amount:</strong> ₹${payment.amount}</p>
    <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
    <p><strong>Paid For:</strong> ${new Date(
      payment.forMonth,
    ).toLocaleDateString()}</p>
    <p><strong>Paid On:</strong> ${new Date(
      payment.paidDate,
    ).toLocaleDateString()}</p>
  `;

  const options = {
    html: htmlContent,
    fileName: `receipt_${student.rollNumber}_${Date.now()}`,
    directory: 'Documents',
  };

  const pdf = await RNHTMLtoPDF.convert(options);
  return pdf.filePath!;
};
