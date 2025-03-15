import { DollarSign, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <div className='w-full  bg-white'>
            <div
                className='flex justify-between items-center p-4   w-full mx-auto max-w-[1200px] border-b border-gray-200'
            >
                <Link href='/'>
                <Image src='/logo.png' alt='logo' width={100} height={100} />
                </Link>
                <div className='flex gap-4'>
                    <Link href='/'>Home</Link>
                    <Link href='/pricing' className='flex items-center gap-1'><DollarSign className='w-4 h-4 text-green-500' /> Pricing</Link>
                    <Link href='/contact' className='flex items-center gap-1'><User className='w-4 h-4 text-[#1098F7]' /> Account</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar