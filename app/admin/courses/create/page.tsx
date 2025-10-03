"use client"
import Link from 'next/link';
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatus } from '@/lib/zodSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import slugify from 'slugify';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/rich-text-editor/Editor';
import { Uploader } from '@/components/file-uploader/Uploader';
import { tryCatch } from '@/hooks/try-catch';
import { useTransition } from 'react';
import { CreateCourse } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
export default function CourseCreationPage(){
    const[isPending,startTransition]=useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title:"" ,
      description:"",
      fileKey:"",
      price: 0,
      duration:0,
      level: "Beginner",
      category:'Energy Efficiency & Conservation',
      status:"Draft",
      slug:"",
      smallDescription:"",
    },
  });

    function onSubmit(values: CourseSchemaType) {
    startTransition(async()=>{
      const{data:result,error}= await tryCatch(CreateCourse(values));
      if(error){
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }
      if(result.status=== 'success'){
        toast.success(result.message);
        form.reset();
        router.push('/admin/courses');
      }
      else if(result.status === 'error'){
        toast.error(result.message);
      }
    })
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
     <div className='*:data-[slot=card]:from-primary/15
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
                <Button type='button' className="w-fit" onClick={()=>{
                  const titleValue = form.getValues("title");
                  const slug= slugify(titleValue);
                  form.setValue("slug",slug, {shouldValidate:true});
                  
                }}> Generate Slug <SparkleIcon className='ml-1' size={16}/> </Button>

                </div>
              <FormField control={form.control} name="smallDescription" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Small Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder='Small Description' className='min-h-[120px]'{...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor field={field} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
                 <FormField control={form.control} name="fileKey" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                            <Uploader value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseCategories.map((category)=>(
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage/>
                        </FormItem>
                )}/>

                <FormField control={form.control} name="level" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseLevels.map((category)=>(
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <FormField control={form.control} name="duration" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Duration (hours)</FormLabel>
                        <FormControl>
                            <Input placeholder='Duration' type='number' {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input placeholder='Price' type='number' {...field}/>
                        </FormControl>
                        <FormMessage/>
                        </FormItem>
                )}/>
               </div>
               <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseStatus.map((category)=>(
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage/>
                        </FormItem>
                )}/>
                <Button className='flex gap-1 items-end' disabled={isPending}>
                 {isPending?(
                  <>
                  Creating...
                  <Loader2 className='animate-spin ml-1' />
                  </>
                 ): ( 
                  <>
                  Create Course <PlusIcon className='ml-2' size={18}/>
                  </>
                  )}
                </Button>

            </form>
          </Form>

        </CardContent>
     </Card>
     </div>
     </> 
    )
}