import Image from "next/image";

export function PhoneImage({ model, className = "", priority = false }: { model: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <Image
        src="/images/phones/phonetic-hero-phone.jpg"
        alt={`Illustrative smartphone image for ${model}`}
        fill
        sizes="(max-width: 640px) 100vw, 240px"
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
      />
      <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-medium text-slate-600">Illustrative image</span>
    </div>
  );
}
