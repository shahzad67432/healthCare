"use client"
import { getbmi } from '@/app/queries'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface BmiData {
    date: string;
    bmi: number | null;
}

const Header = () => {
    const session = useSession()
    const [name, setName] = useState('User')
    const [bmi, setBmi]  = useState(0)

    useEffect(() => {
        if (session && session.data) {
          setName(session.data.user?.name || 'User');
        }
    }, [session]);


    useEffect(() => {
        fetchbmi();
    }, []);
    
    const fetchbmi = async (): Promise<number | null> => {
        // @ts-ignore
        const bmiValue: BmiData[] = await getbmi();
        const getLatestBMI = (data: BmiData[]): number | null => {
          data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const latestEntry = data.find((entry) => entry.bmi !== null && entry.bmi !== undefined);
          return latestEntry ? latestEntry.bmi : null;
        };
        const latestBMI = getLatestBMI(bmiValue);
        setBmi(latestBMI || 0);
        return latestBMI;
    };

    const handleScrollToBMI = () => {
        const bmiSection = document.getElementById('bmiSection');
        if (bmiSection) {
            bmiSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

  return (
    <div>
        <div className='bg-[#2893DF] text-white flex justify-center text-center items-center w-full h-[32px] text-sm rounded-b-md  font-[Montserrat]'>
            Start Your Heath Track Journey
        </div>
        <nav className='flex justify-between px-12 text-center items-center h-[73px] w-full shadow-md'>
            <div className='flex gap-4'>
                <Link href={'/'}>
                    <Image
                        src={'/logo.svg'}
                        height={32}
                        width={32}
                        alt='logo'
                    />
                </Link>
                <Link href={'/'}>
                    <p className='text-black text-[20px] font-[Montserrat] flex items-center text-center opacity-75 font-bold'>HealthTrack</p>
                </Link>
            </div>

            <div className='flex gap-8'>
                <Link href={'/ai'}>
                    <ul className='flex gap-4 font-thin'>
                        <li className=' list-none text-[16px]'> Nutrition tips </li>
                        <li className=' list-none text-[16px]'> Exercise </li>
                    </ul>
                </Link>
                <ul className='flex gap-4 font-thin'>
                    <Link href={'/ai'}>
                        <li className=' list-none text-[16px]'> AI recomendation </li>
                    </Link>
                    <li className='list-none text-[16px]'>
                        <button onClick={handleScrollToBMI} className='focus:outline-none'>
                            BMI
                        </button>
                    </li>
                </ul>
            </div>
            <div className='flex gap-4'>
                <button className='text-white bg-[#2893DF] text-[16px] font-[Monoserrat] rounded-xl p-2 '> Bmi: {bmi} </button>
                <Link href={'/signin'}>
                    <button className='text-white bg-[#2893DF] text-[16px] font-[Monoserrat] rounded-xl p-2 '>Sign In</button>
                </Link>
                <button onClick={fetchbmi} className='text-white bg-[#2893DF] text-[16px] font-[Monoserrat] rounded-xl p-2 '> {name ?? <div>User</div>} </button>
            </div>
        </nav>
    </div>
  )
}

export default Header