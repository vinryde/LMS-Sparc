"use client"
import Link from 'next/link';
import { ArrowLeft, SparkleIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseSchemaType } from '@/lib/zodSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
export default function CourseCreationPage(){
    const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title:"" ,
      description:"",
      fileKey:"",
      price: 0,
      duration:0,
      level: "Beginner",
      category:"",
      status:"Draft",
      slug:"",
      smallDescription:"",
    },
  });

    function onSubmit(values: CourseSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
    return(
     <>
     <div className='flex items-center gap-4'>
        <Link href="/admin/courses" className={buttonVariants({
            variant: "outline",
            size: "icon",
        })}>
        <ArrowLeft className="size-4"/>
        </Link>
        <h1 className='text-2xl font-bold'>Create Courses</h1>
        
     </div> 
     <div className='*:data-[slot=card]:from-primary/10 
                   *:data-[slot=card]:to-card 
                   dark:*:data-[slot=card]:bg-card 
                   *:data-[slot=card]:bg-gradient-to-t 
                   *:data-[slot=card]:shadow-xs'> 
     <Card>
        <CardHeader>
          <CardTitle>Create a New Course</CardTitle>
          <CardDescription> Provide basic information about the course</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}  >
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Title" {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <div className='flex gap-4 items-end'>
                     <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                            <Input  placeholder="Slug" {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <Button type='button' className="w-fit"> Generate Slug <SparkleIcon className='ml-1' size={16}/> </Button>

                </div>

            </form>
          </Form>

        </CardContent>
     </Card>
     </div>
     </> 
    )
}