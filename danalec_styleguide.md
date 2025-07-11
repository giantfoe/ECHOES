<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danelec - Interactive Design Guide</title>
    <!-- Chosen Palette: Danelec Brand Colors (Orange, Dark Grey, Light Grey, White) -->
    <!-- Application Structure Plan: The SPA is structured with a tabbed navigation system ('Brand Elements', 'Color & Gradients', 'Typography & UI') to logically segment the content, mirroring the distinct sections found in the source image. This approach allows users to focus on specific aspects of the brand guidelines without overwhelming them with a single, long scroll. The structure prioritizes clarity and direct representation of the image's content. -->
    <!-- Visualization & Content Choices: 
        - Brand Elements Tab: Goal: Inform. Method: HTML/CSS to represent the logotype, symbol, and exclusion zones as seen in the image. Interaction: None specific, focus on faithful visual replication. Justification: Directly translates the core brand identity elements.
        - Color & Gradients Tab: Goal: Inform/Demonstrate. Method: HTML/CSS color swatches and gradient blocks. Interaction: Clicking color swatches copies hex codes. Justification: Accurately presents the color palette and gradients from the image, making them explorable.
        - Typography & UI Tab: Goal: Inform/Demonstrate. Method: HTML elements for typography examples (headings, body text) and basic UI components (buttons, input fields) styled according to the image's aesthetic. Interaction: Hover effects on buttons. Justification: Showcases the application of the brand's typographic and component styles.
    -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif; /* Reverted to Inter */
            background-color: #F8F8F8;
            color: #333333;
        }
        .header-bg {
            background-color: #FFFFFF;
            border-bottom: 1px solid #E0E0E0;
        }
        .main-content-bg {
            background-color: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .page-header {
            color: #6C757D;
            font-size: 0.75rem; /* 12px */
            font-weight: 600;
            letter-spacing: 0.05em;
        }
        .section-title {
            font-size: 1.5rem; /* 24px */
            font-weight: 700;
            color: #333333;
        }
        .orange-text {
            color: #FF4500; /* Estimated primary orange from image */
        }
        .dark-grey-text {
            color: #333333;
        }
        .light-grey-text {
            color: #6C757D;
        }
        .orange-bg {
            background-color: #FF4500;
        }
        .dark-grey-bg {
            background-color: #333333;
        }
        .light-grey-bg {
            background-color: #F0F0F0;
        }
        .gradient-1 {
            background: linear-gradient(135deg, #FF4500 0%, #333333 100%); /* Orange to Dark Grey */
        }
        .gradient-2 {
            background: linear-gradient(135deg, #FF4500 0%, #6C757D 100%); /* Orange to Meteorite Grey */
        }
        .gradient-3 {
            background: linear-gradient(135deg, #333333 0%, #F0F0F0 100%); /* Dark Grey to Light Grey */
        }
        .nav-tab-active {
            color: #FF4500;
            border-bottom-color: #FF4500;
        }
        .nav-tab-inactive {
            color: #6C757D;
            border-bottom-color: transparent;
        }
        .toast {
            background-color: #333333;
            color: #F8F8F8;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease-out;
        }
        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body class="min-h-screen flex flex-col">

    <div class="header-bg py-4 px-8 flex justify-between items-center">
        <div class="flex items-center">
            <span class="text-xl font-bold dark-grey-text">Danelec</span>
        </div>
        <span class="page-header">PAGE 01</span>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <nav id="app-nav" class="flex justify-center border-b border-gray-200 mb-8">
            <button data-tab="brand-elements" class="nav-tab text-base font-semibold py-3 px-6 border-b-2 transition-colors duration-300">Brand Elements</button>
            <button data-tab="colors-gradients" class="nav-tab text-base font-semibold py-3 px-6 border-b-2 transition-colors duration-300">Colors & Gradients</button>
            <button data-tab="typography-ui" class="nav-tab text-base font-semibold py-3 px-6 border-b-2 transition-colors duration-300">Typography & UI</button>
        </nav>

        <main class="main-content-bg p-8 rounded-2xl">
            <section id="brand-elements" class="app-section">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold dark-grey-text mb-2">Danelec Brand Identity</h2>
                    <p class="max-w-3xl mx-auto text-light-grey-text">This section details the core visual components of the Danelec brand, including the logotype, symbol, and their essential usage guidelines.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div class="p-6 light-grey-bg rounded-lg">
                        <h3 class="section-title mb-4">Logotype</h3>
                        <div class="bg-white p-8 rounded-md flex items-center justify-center h-32">
                            <span class="text-4xl font-bold dark-grey-text">Danelec</span>
                        </div>
                        <p class="text-sm mt-4 text-light-grey-text">The Danelec logotype is designed for clarity and recognition. Ensure consistent application across all media.</p>
                    </div>
                    <div class="p-6 light-grey-bg rounded-lg">
                        <h3 class="section-title mb-4">Symbol</h3>
                        <div class="bg-white p-8 rounded-md flex items-center justify-center h-32">
                            <span class="text-6xl dark-grey-text">&#x25D0;</span> <!-- Placeholder for symbol -->
                        </div>
                        <p class="text-sm mt-4 text-light-grey-text">The Danelec symbol is an abstract representation of our core values, offering a versatile visual mark.</p>
                    </div>
                </div>

                <div class="p-6 light-grey-bg rounded-lg">
                    <h3 class="section-title mb-4">Exclusion Zones</h3>
                    <p class="text-light-grey-text mb-6">The clear space around the logo guarantees its visibility and effectiveness by keeping it separate from other competing visual elements, text, graphics, and images. The diagrams illustrate the appropriate exclusion space, ensuring that no other text or logos overlap upon the designated area.</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-white p-6 rounded-md flex flex-col items-center justify-center h-48">
                            <span class="text-4xl font-bold dark-grey-text">Danelec</span>
                            <div class="border border-dashed border-gray-400 w-48 h-24 mt-4 flex items-center justify-center text-xs text-gray-500">
                                1x clear space
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-md flex flex-col items-center justify-center h-48">
                            <span class="text-6xl dark-grey-text">&#x25D0;</span> <!-- Placeholder for symbol -->
                            <div class="border border-dashed border-gray-400 w-24 h-24 mt-4 flex items-center justify-center text-xs text-gray-500">
                                1x clear space
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="colors-gradients" class="app-section hidden">
                 <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold dark-grey-text mb-2">Color Palette & Gradients</h2>
                    <p class="max-w-3xl mx-auto text-light-grey-text">This section showcases the official Danelec color palette and the approved gradient applications, ensuring visual consistency across all brand touchpoints. Click any color swatch to copy its HEX code.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div class="p-6 light-grey-bg rounded-lg">
                        <h3 class="section-title mb-4">Primary Colors</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="color-swatch cursor-pointer" data-color="#FF4500">
                                <div class="h-20 rounded-md orange-bg"></div>
                                <p class="font-bold mt-2 text-sm dark-grey-text">Primary Orange</p>
                                <p class="text-xs light-grey-text">#FF4500</p>
                            </div>
                            <div class="color-swatch cursor-pointer" data-color="#333333">
                                <div class="h-20 rounded-md dark-grey-bg"></div>
                                <p class="font-bold mt-2 text-sm dark-grey-text">Dark Grey</p>
                                <p class="text-xs light-grey-text">#333333</p>
                            </div>
                            <div class="color-swatch cursor-pointer" data-color="#F8F8F8">
                                <div class="h-20 rounded-md border border-gray-200" style="background-color: #F8F8F8;"></div>
                                <p class="font-bold mt-2 text-sm dark-grey-text">Background White</p>
                                <p class="text-xs light-grey-text">#F8F8F8</p>
                            </div>
                            <div class="color-swatch cursor-pointer" data-color="#6C757D">
                                <div class="h-20 rounded-md" style="background-color: #6C757D;"></div>
                                <p class="font-bold mt-2 text-sm dark-grey-text">Meteorite Grey</p>
                                <p class="text-xs light-grey-text">#6C757D</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 light-grey-bg rounded-lg">
                        <h3 class="section-title mb-4">Gradients</h3>
                        <div class="space-y-4">
                            <div>
                                <p class="font-bold mb-2 text-sm dark-grey-text">Orange to Dark Grey</p>
                                <div class="h-20 rounded-md gradient-1"></div>
                            </div>
                            <div>
                                <p class="font-bold mb-2 text-sm dark-grey-text">Orange to Meteorite Grey</p>
                                <div class="h-20 rounded-md gradient-2"></div>
                            </div>
                            <div>
                                <p class="font-bold mb-2 text-sm dark-grey-text">Dark Grey to Light Grey</p>
                                <div class="h-20 rounded-md gradient-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="typography-ui" class="app-section hidden">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold dark-grey-text mb-2">Typography & UI Elements</h2>
                    <p class="max-w-3xl mx-auto text-light-grey-text">This section outlines the typographic hierarchy and demonstrates key user interface components, ensuring a consistent and professional look for all Danelec digital properties.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="p-6 light-grey-bg rounded-lg">
                        <h3 class="section-title mb-4">Typography</h3>
                        <h1 class="text-4xl font-extrabold dark-grey-text mb-2">H1: Danelec Heading</h1>
                        <h2 class="text-3xl font-bold dark-grey-text mb-2">H2: Section Title</h2>
                        <h3 class="text-2xl font-semibold dark-grey-text mb-4">H3: Sub-section Header</h3>
                        <p class="text-lg dark-grey-text mb-2">Body Large: This is a larger body text for emphasis or key information.</p>
                        <p class="dark-grey-text mb-2">Body Medium: This is the default body text for general content and paragraphs.</p>
                        <p class="text-sm dark-grey-text mb-2">Body Small: Use this for supplementary information or fine print.</p>
                        <p class="text-xs light-grey-text">Caption: Small text for labels or minor details.</p>
                    </div>
                    <div class="p-6 light-grey-bg rounded-lg">
                        <h3 class="section-title mb-4">UI Components</h3>
                        <div class="space-y-6">
                            <button class="w-full py-3 px-6 rounded-md orange-bg text-white font-semibold transition-all duration-300 hover:opacity-90">Primary Button</button>
                            <button class="w-full py-3 px-6 rounded-md border-2 border-orange-bg text-orange-text font-semibold transition-all duration-300 hover:bg-orange-bg hover:text-white">Secondary Button</button>
                            <input type="text" placeholder="Input Field Example" class="w-full p-3 rounded-md border border-gray-300 focus:border-orange-bg focus:ring-0 outline-none transition">
                            <div class="p-4 rounded-md border border-gray-200 dark-grey-text">
                                <p class="font-bold mb-1">Card Title Example</p>
                                <p class="text-sm light-grey-text">This is a sample card demonstrating content block styling.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <div id="toast" class="fixed bottom-10 right-10 toast">
        Copied to clipboard!
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const appState = {
                activeTab: 'brand-elements',
            };

            const nav = document.getElementById('app-nav');
            const sections = document.querySelectorAll('.app-section');
            const navTabs = document.querySelectorAll('.nav-tab');
            const colorSwatches = document.querySelectorAll('.color-swatch');
            const toast = document.getElementById('toast');

            const render = () => {
                sections.forEach(section => {
                    if (section.id === appState.activeTab) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                });

                navTabs.forEach(tab => {
                    if (tab.dataset.tab === appState.activeTab) {
                        tab.classList.add('nav-tab-active');
                        tab.classList.remove('nav-tab-inactive');
                    } else {
                        tab.classList.remove('nav-tab-active');
                        tab.classList.add('nav-tab-inactive');
                    }
                });
            };

            nav.addEventListener('click', (e) => {
                if (e.target.matches('.nav-tab')) {
                    appState.activeTab = e.target.dataset.tab;
                    render();
                }
            });

            colorSwatches.forEach(swatch => {
                swatch.addEventListener('click', () => {
                    const color = swatch.dataset.color;
                    document.execCommand('copy');
                    const tempInput = document.createElement('textarea');
                    tempInput.value = color;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);

                    toast.classList.add('show');
                    setTimeout(() => {
                       toast.classList.remove('show');
                    }, 2000);
                });
            });

            render();
        });
    </script>
</body>
</html>
