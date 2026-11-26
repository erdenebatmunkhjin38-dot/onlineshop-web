"use client"; 
  
import { usePathname } from "next/navigation"; 
import { useEffect, useRef, type ReactNode } from "react"; 
  /** 
*	<details> дээр суурилсан цэс: JavaScript ачаалагдаагүй ч нээгдэж хаагдана. 
*	Нэмэлтээр: хуудас солигдох эсвэл гадна дарахад автоматаар хаагдана. 
 */ 
export function Dropdown({ children }: { children: ReactNode }) {   const ref = useRef<HTMLDetailsElement>(null);   const pathname = usePathname(); 
  
  // Хуудас солигдоход хаана   useEffect(() => { 
    if (ref.current) ref.current.open = false;   }, [pathname]); 
  
  // Цэсний гадна дарахад хаана   useEffect(() => { 
    const onClick = (event: MouseEvent) => { 
      if (ref.current && !ref.current.contains(event.target as Node)) ref.current.open = false; 
    }; 
    document.addEventListener("click", onClick); 
    return () => document.removeEventListener("click", onClick);   }, []); 
  
  return ( 
    <details ref={ref} className="relative"> 
      {children} 
    </details> 
  ); } 
