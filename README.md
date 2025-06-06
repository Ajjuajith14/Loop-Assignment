# 📊 Business Intelligence Dashboard

> A high-performance, interactive dashboard for dynamic data filtering and analysis with modulo datasets

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://ajjugiri-loop-assignment.netlify.app/)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ajjugiri-loop-assignment.netlify.app/)

## 🚀 Live Demo

**[View Live Dashboard →](https://ajjugiri-loop-assignment.netlify.app/)**


## 📋 Overview

This Business Intelligence Dashboard is a modern, responsive web application designed to handle large datasets with dynamic filtering capabilities. Built with performance in mind, it provides an intuitive interface for data exploration and analysis using modulo arithmetic datasets.

### ✨ Key Features

- **🔍 Dynamic Filtering**: Multi-select filters with real-time data updates
- **📊 Interactive Data Table**: Paginated table with virtual scrolling for performance
- **🔎 Global Search**: Search across all columns with highlighting
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Performance Optimized**: Handles large datasets (100K+ records) efficiently
- **🎯 Smart Filter Options**: Filter options update dynamically based on other active filters
- **📈 Performance Monitoring**: Real-time performance metrics display

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 18** - Latest React with concurrent features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **Lucide React** - Beautiful, customizable icons
- **Radix UI** - Headless, accessible UI primitives

### State Management & Performance
- **React Context** - Global state management
- **useMemo & useCallback** - Performance optimization
- **Virtual Scrolling** - Efficient rendering of large lists

### Testing & Quality
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking

### Deployment & Hosting
- **Netlify** - Static site hosting with CI/CD
- **GitHub** - Version control and source code management

## 📊 Datasets

The dashboard works with two carefully crafted datasets that demonstrate different scales of data processing:

### Small Dataset (1,000 records)
- **Columns**: `number`, `mod3`, `mod4`, `mod5`, `mod6`
- **Purpose**: Quick testing and demonstration
- **Use Case**: Ideal for understanding filter interactions

### Large Dataset (100,000 records)
- **Columns**: `number`, `mod350`, `mod8000`, `mod20002`
- **Purpose**: Performance testing and real-world simulation
- **Use Case**: Demonstrates scalability and optimization

Both datasets use modulo arithmetic to create predictable patterns while maintaining realistic data distribution for testing filter combinations and performance optimization.

## 🎯 Core Functionality

### Dynamic Filter Optimization
- **Smart Dependencies**: Filter options update based on other active filters
- **Performance Optimized**: Uses memoization and efficient algorithms
- **User-Friendly**: Auto-closing dropdowns and intuitive interactions

### Advanced Data Table
- **Pagination**: Navigate through large datasets efficiently
- **Virtual Scrolling**: Display only visible rows for performance
- **Search Highlighting**: Visual feedback for search results
- **Responsive Design**: Adapts to different screen sizes

### Real-time Performance Monitoring
- **Filter Processing Time**: Measures filter calculation performance
- **Render Time**: Tracks component rendering efficiency
- **Memory Usage**: Monitors JavaScript heap usage
- **Search Performance**: Debounced search with timing metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Ajjuajith14/Loop-Assignment.git
   cd Loop-Assignment
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
\`\`\`

## 🧪 Testing

The project includes comprehensive tests covering:

- **Component Rendering**: Ensures UI components render correctly
- **User Interactions**: Tests filter selections, pagination, and search
- **Data Processing**: Validates CSV parsing and filter logic
- **Performance**: Monitors rendering and calculation times

Run tests with:
\`\`\`bash
npm test
\`\`\`

## 📈 Performance Features

### Optimization Techniques
- **Memoization**: Expensive calculations cached with `useMemo`
- **Callback Optimization**: Stable function references with `useCallback`
- **Virtual Scrolling**: Only render visible table rows
- **Debounced Search**: Prevents excessive API calls during typing
- **Efficient Data Structures**: Uses Sets and Maps for O(1) lookups

### Performance Metrics
The dashboard includes real-time monitoring of:
- Filter calculation time
- Component render time
- Memory usage tracking
- Search operation timing

## 🎨 Design Philosophy

### User Experience
- **Intuitive Navigation**: Clear visual hierarchy and logical flow
- **Responsive Design**: Seamless experience across all devices
- **Performance First**: Optimized for speed without sacrificing functionality
- **Accessibility**: Built with screen readers and keyboard navigation in mind

### Code Quality
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Modular, reusable components
- **Clean Code**: Consistent formatting and naming conventions
- **Documentation**: Comprehensive comments and README


### Customization
- **Dataset URLs**: Update in `src/components/dashboard-context.tsx`
- **Styling**: Modify Tailwind classes or add custom CSS
- **Performance Settings**: Adjust pagination and virtual scrolling limits

## 🚀 Deployment

The application is automatically deployed to Netlify on every push to the main branch.

### Manual Deployment
\`\`\`bash
npm run build
# Upload 'out' folder to your hosting provider
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Ajjuajith14](https://github.com/Ajjuajith14)
- Portfolio: [Your portfolio](http://ajjugiri-portfolio.netlify.app/)

