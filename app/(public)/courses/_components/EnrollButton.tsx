"use client";
import { tryCatch } from '@/hooks/try-catch';
import { useEffect, useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfetti } from '@/hooks/use-confetti';
import { toast } from 'sonner';
import { enrollInCourseAction } from '../[slug]/actions';
import { Button } from '@/components/ui/button';
import { CheckIcon, Loader2, PlusIcon } from 'lucide-react';

export function EnrollButton({courseId}:{courseId: string}){
  const [isEnrolled, setIsEnrolled] = useState(false);
    const[isPending,startTransition]=useTransition();
    const router = useRouter();
    const {triggerConfetti}=useConfetti() ;
    function onSubmit(values:string ) {
    startTransition(async()=>{
      const{data:result,error}= await tryCatch(enrollInCourseAction(values));
      if(error){
        toast.error("Login to enroll in the course");
        return;
      }
      if(result.status=== 'success'){
        toast.success(result.message);
        triggerConfetti();
        router.push('/dashboard');
      }
      else if(result.status === 'error'){
        toast.error(result.message);
      }
      else if(result.status === 'enrolled'){
        toast.error(result.message);
        router.push('/dashboard');
        setIsEnrolled(true);
      }
    })
  }

  async function checkIfCourseEnrolled(){
        const{data:result,error}= await tryCatch(enrollInCourseAction(courseId));
        if(error){
            toast.error("Login to check enrollment status");
            return;
        }
        if(result.status === 'enrolled'){
            setIsEnrolled(true);
        }
    }

  
  return (
    
  
    
    <Button onLoad={()=>checkIfCourseEnrolled()} onClick={()=>onSubmit(courseId)} disabled={isPending} className='w-full'>
      
      {isPending?(
                  <>
                  Enrolling...
                  <Loader2 className='animate-spin ml-1' />
                  </>
                 ): isEnrolled? (
                  <>
                  You're Already Enrolled <CheckIcon className='ml-2' size={18}/>
                  </>
                  ) : ( 
                  <>
                  Enroll Now <PlusIcon className='ml-2' size={18}/>
                  </>
                  )}
    </Button>
  )
}