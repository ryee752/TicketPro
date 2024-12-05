import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SignUpFrom  from './customerSignUp';
import TicketProLogo from '@/app/ui/ticketpro-logo';
import SignUpForm from './customerSignUp';
import connection from '../../lib/db'


export default function Page() {
  // connection.end();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [first, setFirst] = useState('');
  // const [last, setLast] = useState('');
  // const [phone, setPhone] = useState('');

  // const childToParent = (f: any, l: any, ph: any, e: any, pass: any) =>{
  //   setFirst(f);
  //   setLast(l);
  //   setPhone(ph);
  //   setEmail(e);
  //   setPassword(pass);
  //   registerUser(first, last, phone, email, password);
  // };
  
  // const register = async () => {
  //   registerUser(first, last, phone, email, password);
  // }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-45">
        <TicketProLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <SignUpForm />
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
        </div>
      </div>
    </main>
  );
}