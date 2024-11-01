'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from '@/components/shared/icons'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from '@/components/shared/loading-button'
import { handleGithubSignin, handleCredentialsSignin } from '@/actions/auth-action'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from '@/components/shared/error-message'
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { signInSchema } from '@/lib/zod'


export default function SignInPage() {
  // const [email, setEmail] = useState('')
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const router = useRouter()

  // const handleEmailSignIn = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   try {
  //     const result = await signIn('email', { email, redirect: false })
  //     if (result?.error) {
  //       throw new Error(result.error)
  //     }
  //     router.push('/auth/verify-request')
  //   } catch (error) {
  //     console.error('Failed to sign in:', error)
  //     // Handle error (e.g., show error message to user)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleOAuthSignIn = (provider: 'google' | 'github') => {
  //   setIsLoading(true)
  //   signIn(provider, { callbackUrl: '/dashboard' })
  // }
  const [globalError, setGlobalError] = useState<string>("");
  const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
          email: "",
          password: "",
      },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
      try {
          const result = await handleCredentialsSignin(values);
          if (result?.message) {
              setGlobalError(result.message);
          }
      } catch (error) {
          console.log("An unexpected error occurred. Please try again.");
      }
  };
  return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-gray-800">
                    Welcome Back
                </CardTitle>
            </CardHeader>
            <CardContent>
                {globalError && <ErrorMessage error={globalError} />}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email address"
                                            autoComplete="off"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit button will go here */}
                        <LoadingButton
                            pending={form.formState.isSubmitting}
                        />
                    </form>
                </Form>

                <span className="text-sm text-gray-500 text-center block my-2">
                    or
                </span>
                <form className="w-full" action={handleGithubSignin}>
                    <Button
                        variant="outline"
                        className="w-full"
                        type="submit"
                    >
                        <GitHubLogoIcon className="h-4 w-4 mr-2" />
                        Sign in with GitHub
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>

  )
}


{/* <div className="flex min-h-screen items-center justify-center bg-gray-100">
<div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
  <div className="text-center">
    <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
  </div>
  <div className="mt-8 space-y-6">
    <Button
      onClick={() => handleOAuthSignIn('google')}
      className="w-full"
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      Sign in with Google
    </Button>
    <Button
      onClick={() => handleOAuthSignIn('github')}
      className="w-full"
      variant="outline"
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.gitHub className="mr-2 h-4 w-4" />
      )}
      Sign in with GitHub
    </Button>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>
    <form onSubmit={handleEmailSignIn} className="mt-8 space-y-6">
      <div>
        <Label htmlFor="email" className="sr-only">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Sign in with Email"
        )}
      </Button>
    </form>
  </div>
</div>
</div> */}