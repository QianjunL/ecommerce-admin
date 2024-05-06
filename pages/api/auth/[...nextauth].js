import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import { Admin } from '@/models/Admin';


async function isAdminEmail(email) {
  // to change access control (if not using the return true, it will show timedout error )
  return true;
  // return !! (await Admin.findOne({email}));
}

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session,token,user}) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401).json({ message: "not an admin" });
    return;
  }
}