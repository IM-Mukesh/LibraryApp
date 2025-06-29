// data/fakeStudentData.ts

// Due Students Data (overdue + upcoming within 7 days)
export const dueStudents = [
  // Overdue students
  {
    name: 'Rahul Sharma',
    rollNumber: 'CS001',
    dueDate: '2025-06-30', // 9 days overdue
    phone: '+918789067634',
  },
  {
    name: 'Mukesh Patel',
    rollNumber: 'EC002',
    dueDate: '2025-06-12', // 7 days overdue
    phone: '8789067634',
  },
  {
    name: 'Amit Kumar',
    rollNumber: 'ME003',
    dueDate: '2025-06-15', // 4 days overdue
    phone: '+919876543212',
  },
  {
    name: 'Sneha Gupta',
    rollNumber: 'IT004',
    dueDate: '2025-06-17', // 2 days overdue
    phone: '+919876543213',
  },
  {
    name: 'Vikash Singh',
    rollNumber: 'CE005',
    dueDate: '2025-06-18', // 1 day overdue
    phone: '+919876543214',
  },

  // Due today and upcoming (within 7 days)
  {
    name: 'Anjali Verma',
    rollNumber: 'CS006',
    dueDate: '2025-06-19', // Due today
    phone: '+919876543215',
  },
  {
    name: 'Rohit Agarwal',
    rollNumber: 'EC007',
    dueDate: '2025-06-20', // Due tomorrow
    phone: '+919876543216',
  },
  {
    name: 'Kavya Joshi',
    rollNumber: 'ME008',
    dueDate: '2025-06-21', // Due in 2 days
    phone: '+919876543217',
  },
  {
    name: 'Arjun Nair',
    rollNumber: 'IT009',
    dueDate: '2025-06-22', // Due in 3 days
    phone: '+919876543218',
  },
  {
    name: 'Pooja Reddy',
    rollNumber: 'CE010',
    dueDate: '2025-06-24', // Due in 5 days
    phone: '+919876543219',
  },
  {
    name: 'Manish Yadav',
    rollNumber: 'CS011',
    dueDate: '2025-06-25', // Due in 6 days
    phone: '+919876543220',
  },
  {
    name: 'Riya Sinha',
    rollNumber: 'EC012',
    dueDate: '2025-06-26', // Due in 7 days
    phone: '+919876543221',
  },

  // Student without phone (to test missing phone scenario)
  {
    name: 'Dev Malhotra',
    rollNumber: 'ME013',
    dueDate: '2025-06-23', // Due in 4 days
    // No phone number
  },
];

// Paid Students Data (recent payments)
export const paidStudents = [
  // Payments from today
  {
    name: 'Aditi Chopra',
    rollNumber: 'CS101',
    paidDate: '2025-06-19', // Today
    amount: 25000,
  },
  {
    name: 'Karan Mehta',
    rollNumber: 'EC102',
    paidDate: '2025-06-19', // Today
    amount: 28000,
  },

  // Yesterday's payments
  {
    name: 'Neha Bansal',
    rollNumber: 'ME103',
    paidDate: '2025-06-18', // Yesterday
    amount: 30000,
  },
  {
    name: 'Saurav Dubey',
    rollNumber: 'IT104',
    paidDate: '2025-06-18', // Yesterday
    amount: 22000,
  },
  {
    name: 'Ishita Khanna',
    rollNumber: 'CE105',
    paidDate: '2025-06-18', // Yesterday
    amount: 26000,
  },

  // 2 days ago
  {
    name: 'Harsh Pandey',
    rollNumber: 'CS106',
    paidDate: '2025-06-17', // 2 days ago
    amount: 24000,
  },
  {
    name: 'Tanya Kapoor',
    rollNumber: 'EC107',
    paidDate: '2025-06-17', // 2 days ago
    amount: 27000,
  },

  // 3 days ago
  {
    name: 'Abhishek Jain',
    rollNumber: 'ME108',
    paidDate: '2025-06-16', // 3 days ago
    amount: 29000,
  },
  {
    name: 'Sakshi Bhatt',
    rollNumber: 'IT109',
    paidDate: '2025-06-16', // 3 days ago
    amount: 23000,
  },

  // 4 days ago
  {
    name: 'Nikhil Saxena',
    rollNumber: 'CE110',
    paidDate: '2025-06-15', // 4 days ago
    amount: 25500,
  },
  {
    name: 'Divya Mittal',
    rollNumber: 'CS111',
    paidDate: '2025-06-15', // 4 days ago
    amount: 31000,
  },

  // 5 days ago
  {
    name: 'Gaurav Tiwari',
    rollNumber: 'EC112',
    paidDate: '2025-06-14', // 5 days ago
    amount: 26500,
  },
  {
    name: 'Shweta Arora',
    rollNumber: 'ME113',
    paidDate: '2025-06-14', // 5 days ago
    amount: 28500,
  },

  // 1 week ago
  {
    name: 'Rajesh Kumar',
    rollNumber: 'IT114',
    paidDate: '2025-06-12', // 1 week ago
    amount: 24500,
  },
  {
    name: 'Meera Shah',
    rollNumber: 'CE115',
    paidDate: '2025-06-12', // 1 week ago
    amount: 27500,
  },

  // 10 days ago
  {
    name: 'Vishal Gupta',
    rollNumber: 'CS116',
    paidDate: '2025-06-09', // 10 days ago
    amount: 32000,
  },
  {
    name: 'Asha Rani',
    rollNumber: 'EC117',
    paidDate: '2025-06-09', // 10 days ago
    amount: 21000,
  },

  // 2 weeks ago
  {
    name: 'Deepak Mishra',
    rollNumber: 'ME118',
    paidDate: '2025-06-05', // 2 weeks ago
    amount: 29500,
  },
  {
    name: 'Ritika Sood',
    rollNumber: 'IT119',
    paidDate: '2025-06-05', // 2 weeks ago
    amount: 26800,
  },

  // 3 weeks ago
  {
    name: 'Ankit Tyagi',
    rollNumber: 'CE120',
    paidDate: '2025-05-29', // 3 weeks ago
    amount: 33000,
  },
];

// Usage Example:
/*
  import { dueStudents, paidStudents } from './data/fakeStudentData';
  import FeeManagementContainer from './components/FeeManagement/FeeManagementContainer';
  
  function App() {
    return (
      <FeeManagementContainer 
        dueStudents={dueStudents} 
        paidStudents={paidStudents} 
      />
    );
  }
  */
