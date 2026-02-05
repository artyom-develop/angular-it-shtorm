import { z } from 'zod';

export type SignupModel = z.infer<typeof SignupSchema>;

export type LoginModel = z.infer<typeof LoginSchema>;

const FullSchema = z.object({
  firstName: z.string().regex(/^[A-ZА-ЯЁ][a-zа-яё]+$/, {
    message: 'Имя должно быть с большой буквы и содержать только буквы',
  }),
  email: z.string().email({ message: 'Некорректный email адрес' }),
  password: z
    .string()
    .min(8, { message: 'Должно быть минимум 8 символов' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
      }
    ),
  agree: z
    .boolean()
    .refine(val => val === true, {
      message: 'Необходимо принять пользовательское соглашение',
    }),
  rememberMe: z.boolean().optional(),
  repeatPassword: z
    .string()
});

export const LoginSchema = FullSchema.pick({
  email: true,
  password: true,
  rememberMe: true,
}).extend({
  rememberMe: z.boolean().optional().default(false),
});

export const SignupSchema = FullSchema.pick({
  firstName: true,
  email: true,
  password: true,
  repeatPassword: true,
  agree: true,
}).refine(data => data.password === data.repeatPassword, {
  message: 'Пароли не совпадают',
  path: ['repeatPassword'],
});

// export function ValidateForm<T extends z.ZodObject>(schema: T, value: SignupModel | LoginModel) {
//   const res = schema.safeParse(value);
//   if (res.success) {
//     return {
//       success: true as const,
//       data: res.data,
//       errors: {} as ValidationErrors,
//     };
//   }

//   const errors: ValidationErrors = res.error.issues.reduce((acc, issue) => {
//     const field = issue.path[0]?.toString() ?? '_form';
//     const message = issue.message ?? 'Ошибка валидации';
//     (acc[field] ??= []).push(message);
//     return acc;
//   }, {} as ValidationErrors);
//   return {
//     success: false as const,
//     data: null,
//     errors,
//   };
// }
