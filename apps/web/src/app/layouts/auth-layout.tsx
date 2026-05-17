import { Outlet } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

import { Logo } from '@/components/common/icons/LogoIcon';
import { FlashIcon } from '@/components/common/icons/FlashIcon';
import { CheckCircleIcon } from '@/components/common/icons/CheckCircleIcon';

import { PublicRoute } from '@/features/auth/components/public-route';

export default function AuthLayout() {
    return (
        <PublicRoute>
            <div className="flex w-full h-screen overflow-hidden bg-[#0D0D0D]">
                <aside className="relative h-full overflow-hidden flex flex-col items-start justify-start w-[45%] bg-[linear-gradient(135deg,#181818_0%,#161616_16.67%,#131313_33.33%,#111_50%,#0F0F0F_66.67%,#0C0C0C_83.33%,#0A0A0A_100%)]">
                    <div className="w-[80%] h-full flex flex-col items-start justify-between p-12">
                        <div className="h-full flex flex-col items-start justify-start gap-6">
                            {/* logo */}
                            <Link to="/" className="flex items-center justify-start h-10 gap-3">
                                <Logo backgroundColor='#F59E0B' iconColor='#181818' className='w-10 h-10' />
                                <span className='size-6 font-semibold text-white'>Courier</span>
                            </Link>

                            {/* title */}
                            <div className="pt-9">
                                <h1 className="text-5xl font-bold text-white">
                                    Build, test and <br />
                                    automate APIs <br />
                                    faster.
                                </h1>
                            </div>

                            {/* description */}
                            <div>
                                <p className="text-xl font-normal text-[#9F9FA9] ">
                                    Professional API workflows for modern engineering teams.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-end gap-3 w-full">
                            <div className="p-4 w-full flex flex-col items-start justify-start gap-2 border border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#181818] rounded-lg">
                                <div className="flex items-center justify-start gap-3 text-sm font-normal text-[#9F9FA9]">
                                    <span className="py-1 px-2 border border-[rgba(0,188,125,0.20)] bg-[rgba(0,188,125,0.10)] font-medium text-[#00D492] rounded">GET</span> api.courier.dev/v1/users
                                </div>
                                <div className="flex items-center justify-start gap-2">
                                    <CheckCircleIcon />
                                    <p className='flex gap-2 text-[12px] font-normal text-[#71717B]'>
                                        <span>200 OK</span>
                                        <span>•</span>
                                        <span>142ms</span>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 w-[94%] flex flex-col items-start justify-start gap-2 border border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#181818] rounded-lg">
                                <div className="flex items-center justify-start gap-3 text-sm font-normal text-[#9F9FA9]">
                                    <span className="py-1 px-2 border border-[rgba(254,154,0,0.20)] bg-[rgba(254,154,0,0.10)] font-medium text-[#FFB900] rounded">POST</span> api.courier.dev/v1/messages
                                </div>
                                <div className="flex items-center justify-start gap-2">
                                    <FlashIcon />
                                    <p className='flex gap-2 text-[12px] font-normal text-[#71717B]'>
                                        <span>201 Created</span>
                                        <span>•</span>
                                        <span>89ms</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 -right-42 -translate-y-1/2 w-2/4 h-2/4 rounded-full bg-[rgba(254,154,0,0.05)] blur-[128px] pointer-events-none" />
                    <div className="absolute top-1/2 -left-42 -translate-y-1/2 w-2/4 h-2/4 rounded-full bg-[rgba(254,154,0,0.05)] blur-[128px] pointer-events-none" />
                </aside>
                <main className="flex-1 flex flex-col items-center gap-8 p-12 overflow-y-auto">
                    <Outlet />

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <Link to="/login" className='hover:text-zinc-400'>Privacy</Link>
                        <Link to="/login" className='hover:text-zinc-400'>Terms</Link>
                        <Link to="/login" className='hover:text-zinc-400'>Help</Link>
                    </div>
                </main>
            </div>
        </PublicRoute>
    );
}