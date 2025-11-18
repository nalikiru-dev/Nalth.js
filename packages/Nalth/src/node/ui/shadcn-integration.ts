import { execSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

export interface ShadcnConfig {
  style: 'default' | 'new-york'
  baseColor: 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  cssVariables: boolean
  rsc: boolean
  tsx: boolean
  tailwind: {
    config: string
    css: string
    baseColor: string
    cssVariables: boolean
  }
  aliases: {
    components: string
    utils: string
  }
}

export class ShadcnIntegration {
  private projectPath: string
  private config: ShadcnConfig

  constructor(projectPath: string, config?: Partial<ShadcnConfig>) {
    this.projectPath = projectPath
    this.config = {
      style: 'default',
      baseColor: 'slate',
      cssVariables: true,
      rsc: false,
      tsx: true,
      tailwind: {
        config: 'tailwind.config.ts',
        css: 'src/index.css',
        baseColor: 'slate',
        cssVariables: true
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils'
      },
      ...config
    }
  }

  async setupShadcn(): Promise<void> {
    console.log('🎨 Setting up shadcn/ui with security enhancements...')

    // 1. Install required dependencies
    await this.installDependencies()

    // 2. Setup Tailwind CSS
    await this.setupTailwind()

    // 3. Create components.json config
    await this.createComponentsConfig()

    // 4. Setup path aliases
    await this.setupPathAliases()

    // 5. Create secure utility functions
    await this.createSecureUtils()

    // 6. Setup secure component templates
    await this.createSecureComponents()

    console.log('✅ shadcn/ui setup complete with security enhancements!')
  }

  private async installDependencies(): Promise<void> {
    const dependencies = [
      'tailwindcss',
      'autoprefixer',
      'postcss',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip'
    ]

    const devDependencies = [
      '@types/node',
      'tailwindcss-animate'
    ]

    console.log('📦 Installing shadcn/ui dependencies...')
    
    try {
      execSync(`npm install ${dependencies.join(' ')}`, {
        cwd: this.projectPath,
        stdio: 'inherit'
      })

      execSync(`npm install -D ${devDependencies.join(' ')}`, {
        cwd: this.projectPath,
        stdio: 'inherit'
      })
    } catch (error) {
      console.error('Failed to install dependencies:', error)
      throw error
    }
  }

  private async setupTailwind(): Promise<void> {
    // Create tailwind.config.ts
    const tailwindConfig = `import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config`

    writeFileSync(resolve(this.projectPath, 'tailwind.config.ts'), tailwindConfig)

    // Create postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`

    writeFileSync(resolve(this.projectPath, 'postcss.config.js'), postcssConfig)

    // Update CSS file with Tailwind and CSS variables
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`

    const cssPath = resolve(this.projectPath, this.config.tailwind.css)
    mkdirSync(dirname(cssPath), { recursive: true })
    writeFileSync(cssPath, cssContent)
  }

  private async createComponentsConfig(): Promise<void> {
    const componentsConfig = {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": this.config.style,
      "rsc": this.config.rsc,
      "tsx": this.config.tsx,
      "tailwind": {
        "config": this.config.tailwind.config,
        "css": this.config.tailwind.css,
        "baseColor": this.config.tailwind.baseColor,
        "cssVariables": this.config.tailwind.cssVariables
      },
      "aliases": {
        "components": this.config.aliases.components,
        "utils": this.config.aliases.utils
      }
    }

    writeFileSync(
      resolve(this.projectPath, 'components.json'),
      JSON.stringify(componentsConfig, null, 2)
    )
  }

  private async setupPathAliases(): Promise<void> {
    // Update tsconfig.json with path aliases
    const tsconfigPath = resolve(this.projectPath, 'tsconfig.json')
    
    if (existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {}
      }
      
      tsconfig.compilerOptions.baseUrl = "."
      tsconfig.compilerOptions.paths = {
        "@/*": ["./src/*"]
      }
      
      writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
    }

    // Update vite.config.ts or nalth.config.ts with path aliases
    const configFiles = ['nalth.config.ts', 'vite.config.ts']
    
    for (const configFile of configFiles) {
      const configPath = resolve(this.projectPath, configFile)
      
      if (existsSync(configPath)) {
        let content = readFileSync(configPath, 'utf-8')
        
        // Add path import if not present
        if (!content.includes('import { resolve }')) {
          content = `import { resolve } from 'path'\n${content}`
        }
        
        // Add resolve alias to config
        if (!content.includes('resolve:')) {
          content = content.replace(
            /export default defineConfig\(\{/,
            `export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },`
          )
        }
        
        writeFileSync(configPath, content)
        break
      }
    }
  }

  private async createSecureUtils(): Promise<void> {
    const utilsDir = resolve(this.projectPath, 'src/lib')
    mkdirSync(utilsDir, { recursive: true })

    // Create secure utility functions
    const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Secure HTML sanitization for user content
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Secure URL validation
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Generate secure random IDs
export function generateSecureId(): string {
  return crypto.randomUUID()
}

// Secure event handler wrapper
export function secureEventHandler<T extends Event>(
  handler: (event: T) => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {}
) {
  return (event: T) => {
    if (options.preventDefault) {
      event.preventDefault()
    }
    if (options.stopPropagation) {
      event.stopPropagation()
    }
    
    try {
      handler(event)
    } catch (error) {
      console.error('Event handler error:', error)
      // Log security event if needed
    }
  }
}`

    writeFileSync(resolve(utilsDir, 'utils.ts'), utilsContent)
  }

  private async createSecureComponents(): Promise<void> {
    const componentsDir = resolve(this.projectPath, 'src/components/ui')
    mkdirSync(componentsDir, { recursive: true })

    // Create secure Button component
    const buttonComponent = `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, secureEventHandler } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const secureOnClick = onClick ? secureEventHandler(onClick, { 
      preventDefault: false, 
      stopPropagation: false 
    }) : undefined
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={secureOnClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`

    writeFileSync(resolve(componentsDir, 'button.tsx'), buttonComponent)

    // Create secure Input component
    const inputComponent = `import * as React from "react"
import { cn, sanitizeHTML } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitize?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, sanitize = false, onChange, ...props }, ref) => {
    const secureOnChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (sanitize && type === 'text') {
          const sanitizedValue = sanitizeHTML(event.target.value)
          event.target.value = sanitizedValue
        }
        
        onChange?.(event)
      },
      [onChange, sanitize, type]
    )

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={secureOnChange}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }`

    writeFileSync(resolve(componentsDir, 'input.tsx'), inputComponent)

    // Create secure Card component
    const cardComponent = `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`

    writeFileSync(resolve(componentsDir, 'card.tsx'), cardComponent)
  }

  async addComponent(componentName: string): Promise<void> {
    console.log(`🎨 Adding shadcn/ui component: ${componentName}`)
    
    try {
      execSync(`npx shadcn-ui@latest add ${componentName}`, {
        cwd: this.projectPath,
        stdio: 'inherit'
      })
      
      console.log(`✅ Successfully added ${componentName} component`)
    } catch (error) {
      console.error(`Failed to add ${componentName} component:`, error)
      throw error
    }
  }
}
