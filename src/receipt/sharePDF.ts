import Share from 'react-native-share';

export const sharePDF = async (filePath: string) => {
  try {
    await Share.shareSingle({
      url: `file://${filePath}`,
      type: 'application/pdf',
      social: Share.Social.WHATSAPP as 'whatsapp',
    });
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
  }
};

// import { generateReceipt } from '@/utils/generateReceipt';
// import { sharePDF } from '@/utils/sharePDF';

// const handleShareReceipt = async () => {
//   try {
//     const filePath = await generateReceipt(student, payment); // Both should be full objects
//     await sharePDF(filePath);
//   } catch (error) {
//     console.error('Error sharing receipt:', error);
//   }
// };
