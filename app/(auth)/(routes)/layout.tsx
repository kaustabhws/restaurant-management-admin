import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full max-[830px]:flex-col max-[830px]:items-center max-[830px]:justify-center max-[830px]:bg-cover max-[830px]:bg-center auth-bg">
      {/* Left Side - Image (Hidden on Small Screens) */}
      <div className="w-1/2 h-screen relative max-[830px]:hidden">
        <Image 
          src="/login-hero.png" 
          alt="Login Hero"
          layout="fill"
          objectFit="contain"
          unoptimized
        />
      </div>
      
      {/* Right Side - Children */}
      <div className="w-1/2 flex items-center justify-center p-10 max-[830px]:w-full max-[830px]:p-5">
        {children}
      </div>
    </div>
  );
}