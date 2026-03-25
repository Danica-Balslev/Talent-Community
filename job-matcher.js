// Klaviyo Job Matcher Application
class JobMatcher {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.displayedJobs = 0;
        this.jobsPerPage = 12;
        this.candidateProfile = null;
        this.matchedJobs = [];
        
        // Skill synonyms for better matching
        this.skillSynonyms = {
            'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'node', 'nodejs', 'node.js'],
            'typescript': ['ts'],
            'python': ['py', 'python3', 'django', 'flask', 'fastapi'],
            'react': ['reactjs', 'react.js', 'react native'],
            'angular': ['angularjs', 'angular.js'],
            'vue': ['vuejs', 'vue.js'],
            'machine learning': ['ml', 'deep learning', 'neural network', 'ai', 'artificial intelligence'],
            'data science': ['data scientist', 'data analytics', 'statistical analysis'],
            'sql': ['mysql', 'postgresql', 'postgres', 'sqlite', 'oracle', 'sql server', 'mssql'],
            'nosql': ['mongodb', 'dynamodb', 'cassandra', 'redis', 'elasticsearch'],
            'aws': ['amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'],
            'gcp': ['google cloud', 'google cloud platform', 'bigquery'],
            'azure': ['microsoft azure', 'azure devops'],
            'devops': ['ci/cd', 'jenkins', 'github actions', 'gitlab ci', 'continuous integration'],
            'kubernetes': ['k8s', 'container orchestration'],
            'docker': ['containers', 'containerization'],
            'agile': ['scrum', 'kanban', 'sprint', 'jira'],
            'project management': ['pm', 'program management', 'pmp'],
            'customer success': ['csm', 'customer success manager', 'client success'],
            'sales': ['account executive', 'ae', 'business development', 'bdr', 'sdr'],
            'marketing': ['digital marketing', 'growth marketing', 'demand generation', 'demand gen'],
            'product management': ['product manager', 'pm', 'product owner'],
            'ux': ['user experience', 'ux design', 'ux research', 'usability'],
            'ui': ['user interface', 'ui design', 'visual design'],
            'figma': ['sketch', 'adobe xd', 'invision'],
            'analytics': ['google analytics', 'mixpanel', 'amplitude', 'tableau', 'looker'],
            'crm': ['salesforce', 'hubspot', 'dynamics'],
            'email marketing': ['klaviyo', 'mailchimp', 'sendgrid', 'marketing automation'],
            'finance': ['fp&a', 'financial planning', 'financial analysis', 'budgeting'],
            'accounting': ['gaap', 'bookkeeping', 'accounts payable', 'accounts receivable'],
            'hr': ['human resources', 'people operations', 'talent acquisition', 'recruiting']
        };

        // Experience level patterns with confidence weights
        this.experienceLevels = {
            'entry': {
                patterns: ['intern', 'internship', 'entry level', 'entry-level', 'junior', 'associate', 'coordinator', 'assistant', 'graduate', 'trainee'],
                weight: 1,
                range: '0-2'
            },
            'mid': {
                patterns: ['specialist', 'analyst', 'engineer ii', 'engineer 2', 'level 2', 'mid-level', 'mid level'],
                weight: 2,
                range: '2-5'
            },
            'senior': {
                patterns: ['senior', 'sr.', 'sr ', 'lead', 'iii', 'engineer 3', 'level 3', 'experienced'],
                weight: 3,
                range: '5-8'
            },
            'staff': {
                patterns: ['staff', 'principal', 'architect', 'manager', 'team lead', 'tech lead'],
                weight: 4,
                range: '8-12'
            },
            'executive': {
                patterns: ['director', 'head of', 'vp', 'vice president', 'chief', 'cto', 'cfo', 'cmo', 'ceo', 'evp', 'svp', 'senior director'],
                weight: 5,
                range: '12+'
            }
        };

        // Scoring weights (total = 100)
        this.scoringWeights = {
            location: 15,      // Binary: within 30mi of hub = 15, else 0
            department: 25,    // Granular department matching
            experience: 25,
            skills: 25,
            keywordRelevance: 10
        };

        // Hub city coordinates for 30-mile radius matching
        this.hubCities = {
            'boston': { lat: 42.3601, lng: -71.0589, aliases: ['cambridge', 'somerville', 'quincy', 'brookline', 'newton', 'waltham', 'medford', 'malden'] },
            'denver': { lat: 39.7392, lng: -104.9903, aliases: ['boulder', 'aurora', 'lakewood', 'littleton', 'englewood', 'arvada', 'westminster'] },
            'san francisco': { lat: 37.7749, lng: -122.4194, aliases: ['sf', 'san jose', 'oakland', 'berkeley', 'fremont', 'sunnyvale', 'santa clara', 'mountain view', 'redwood city', 'daly city'] },
            'palo alto': { lat: 37.4419, lng: -122.1430, aliases: ['menlo park', 'stanford', 'los altos', 'cupertino', 'saratoga'] },
            'london': { lat: 51.5074, lng: -0.1278, aliases: ['westminster', 'canary wharf', 'shoreditch', 'hackney', 'islington', 'camden', 'greenwich'] },
            'sydney': { lat: -33.8688, lng: 151.2093, aliases: ['north sydney', 'parramatta', 'chatswood', 'bondi', 'manly', 'surry hills'] },
            'dublin': { lat: 53.3498, lng: -6.2603, aliases: ['dun laoghaire', 'blackrock', 'sandyford', 'tallaght', 'swords'] }
        };

        // Extended city coordinates for geocoding job locations
        this.cityCoordinates = {
            // US Cities
            'boston': { lat: 42.3601, lng: -71.0589 },
            'cambridge': { lat: 42.3736, lng: -71.1097 },
            'somerville': { lat: 42.3876, lng: -71.0995 },
            'denver': { lat: 39.7392, lng: -104.9903 },
            'boulder': { lat: 40.0150, lng: -105.2705 },
            'san francisco': { lat: 37.7749, lng: -122.4194 },
            'sf': { lat: 37.7749, lng: -122.4194 },
            'palo alto': { lat: 37.4419, lng: -122.1430 },
            'mountain view': { lat: 37.3861, lng: -122.0839 },
            'sunnyvale': { lat: 37.3688, lng: -122.0363 },
            'san jose': { lat: 37.3382, lng: -121.8863 },
            'oakland': { lat: 37.8044, lng: -122.2712 },
            'berkeley': { lat: 37.8716, lng: -122.2727 },
            'redwood city': { lat: 37.4852, lng: -122.2364 },
            'menlo park': { lat: 37.4530, lng: -122.1817 },
            'cupertino': { lat: 37.3230, lng: -122.0322 },
            'santa clara': { lat: 37.3541, lng: -121.9552 },
            'fremont': { lat: 37.5485, lng: -121.9886 },
            'new york': { lat: 40.7128, lng: -74.0060 },
            'nyc': { lat: 40.7128, lng: -74.0060 },
            'los angeles': { lat: 34.0522, lng: -118.2437 },
            'la': { lat: 34.0522, lng: -118.2437 },
            'seattle': { lat: 47.6062, lng: -122.3321 },
            'austin': { lat: 30.2672, lng: -97.7431 },
            'chicago': { lat: 41.8781, lng: -87.6298 },
            'atlanta': { lat: 33.7490, lng: -84.3880 },
            // UK & Europe
            'london': { lat: 51.5074, lng: -0.1278 },
            'dublin': { lat: 53.3498, lng: -6.2603 },
            'amsterdam': { lat: 52.3676, lng: 4.9041 },
            'berlin': { lat: 52.5200, lng: 13.4050 },
            'paris': { lat: 48.8566, lng: 2.3522 },
            // APAC
            'sydney': { lat: -33.8688, lng: 151.2093 },
            'melbourne': { lat: -37.8136, lng: 144.9631 },
            'singapore': { lat: 1.3521, lng: 103.8198 },
            'tokyo': { lat: 35.6762, lng: 139.6503 }
        };

        // Granular department mappings (Department - Subdepartment)
        this.departmentMappings = {
            'engineering': {
                'Engineering - Backend': ['backend engineer', 'backend developer', 'server engineer', 'api engineer', 'platform engineer'],
                'Engineering - Frontend': ['frontend engineer', 'frontend developer', 'ui engineer', 'web developer'],
                'Engineering - Full Stack': ['full stack', 'fullstack', 'software engineer', 'software developer'],
                'Engineering - Mobile': ['mobile engineer', 'ios engineer', 'android engineer', 'mobile developer'],
                'Engineering - DevOps': ['devops', 'site reliability', 'sre', 'infrastructure engineer', 'platform engineer'],
                'Engineering - Data': ['data engineer', 'etl', 'data infrastructure', 'analytics engineer'],
                'Engineering - Security': ['security engineer', 'seceng', 'appsec', 'security architect'],
                'Engineering - QA': ['qa engineer', 'quality assurance', 'test engineer', 'sdet']
            },
            'product': {
                'Product - Management': ['product manager', 'senior product manager', 'group product manager', 'product lead'],
                'Product - Operations': ['product operations', 'product ops'],
                'Product - Analytics': ['product analyst', 'product analytics']
            },
            'design': {
                'Design - Product': ['product designer', 'ux designer', 'ui designer'],
                'Design - Visual': ['visual designer', 'graphic designer', 'brand designer'],
                'Design - Research': ['ux researcher', 'user researcher', 'design researcher'],
                'Design - Content': ['content designer', 'ux writer', 'content strategist']
            },
            'sales': {
                'Sales - Account Executive': ['account executive', 'ae ', 'enterprise ae', 'commercial ae', 'strategic ae'],
                'Sales - Business Development': ['business development', 'bdr', 'sdr', 'sales development'],
                'Sales - Management': ['sales manager', 'sales director', 'vp sales', 'head of sales'],
                'Sales - Solutions': ['solutions engineer', 'solutions architect', 'sales engineer', 'pre-sales'],
                'Sales - Operations': ['sales operations', 'sales ops', 'revenue operations', 'revops']
            },
            'marketing': {
                'Marketing - Demand Generation': ['demand generation', 'demand gen', 'growth marketing', 'performance marketing'],
                'Marketing - Content': ['content marketing', 'content manager', 'copywriter', 'content strategist'],
                'Marketing - Brand': ['brand marketing', 'brand manager', 'creative marketing'],
                'Marketing - Product Marketing': ['product marketing', 'pmm', 'product marketing manager'],
                'Marketing - Events': ['event marketing', 'field marketing', 'events manager'],
                'Marketing - Communications': ['communications', 'pr ', 'public relations', 'corporate communications'],
                'Marketing - Operations': ['marketing operations', 'marketing ops', 'martech']
            },
            'customer-success': {
                'Customer Success - Management': ['customer success manager', 'csm', 'client success'],
                'Customer Success - Onboarding': ['onboarding', 'implementation', 'customer onboarding'],
                'Customer Success - Support': ['customer support', 'technical support', 'support engineer', 'support specialist'],
                'Customer Success - Operations': ['cs operations', 'customer operations', 'success operations']
            },
            'finance': {
                'Finance - FP&A': ['fp&a', 'financial planning', 'financial analyst', 'finance analyst'],
                'Finance - Accounting': ['accounting', 'accountant', 'controller', 'accounts payable', 'accounts receivable'],
                'Finance - Procurement': ['procurement', 'purchasing', 'vendor management', 'sourcing'],
                'Finance - Treasury': ['treasury', 'cash management'],
                'Finance - Tax': ['tax ', 'tax manager', 'tax analyst'],
                'Finance - Revenue': ['revenue', 'billing', 'revenue operations', 'deal desk']
            },
            'hr': {
                'People - Recruiting': ['recruiter', 'talent acquisition', 'recruiting', 'sourcer'],
                'People - HR Business Partner': ['hr business partner', 'hrbp', 'people partner'],
                'People - Operations': ['people operations', 'hr operations', 'people ops'],
                'People - Learning': ['learning and development', 'l&d', 'training', 'enablement'],
                'People - Compensation': ['compensation', 'benefits', 'total rewards']
            },
            'data': {
                'Data - Science': ['data scientist', 'machine learning', 'ml engineer', 'ai engineer'],
                'Data - Analytics': ['data analyst', 'business analyst', 'analytics', 'bi analyst'],
                'Data - Engineering': ['data engineer', 'analytics engineer', 'data infrastructure']
            },
            'operations': {
                'Operations - Business': ['business operations', 'biz ops', 'operations manager'],
                'Operations - Program': ['program manager', 'program management', 'pmo'],
                'Operations - Project': ['project manager', 'project management'],
                'Operations - Strategy': ['strategy', 'strategic operations', 'chief of staff']
            },
            'security': {
                'Security - Engineering': ['security engineer', 'application security', 'infrastructure security'],
                'Security - Compliance': ['compliance', 'grc', 'risk', 'audit'],
                'Security - Operations': ['security operations', 'secops', 'soc analyst']
            },
            'legal': {
                'Legal - Corporate': ['corporate counsel', 'legal counsel', 'attorney'],
                'Legal - Commercial': ['commercial counsel', 'contracts', 'contract manager'],
                'Legal - Privacy': ['privacy', 'data protection', 'dpo']
            }
        };
        
        this.init();
    }

    async init() {
        await this.fetchJobs();
        this.setupEventListeners();
        this.updateStats();
        this.populateFilters();
        this.displayAllJobs();
    }

    // ========== FUZZY MATCHING UTILITIES ==========
    
    // Calculate Levenshtein distance between two strings
    levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                }
            }
        }
        return dp[m][n];
    }

    // Calculate similarity score (0-1) between two strings
    stringSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        str1 = str1.toLowerCase().trim();
        str2 = str2.toLowerCase().trim();
        
        if (str1 === str2) return 1;
        if (str1.includes(str2) || str2.includes(str1)) return 0.9;
        
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return maxLength === 0 ? 1 : 1 - (distance / maxLength);
    }

    // Check if a skill matches (with synonyms and fuzzy matching)
    skillMatches(candidateSkill, targetText) {
        const skill = candidateSkill.toLowerCase().trim();
        const text = targetText.toLowerCase();
        
        // Direct match
        if (text.includes(skill)) return { match: true, confidence: 1.0, type: 'exact' };
        
        // Check synonyms
        for (const [canonical, synonyms] of Object.entries(this.skillSynonyms)) {
            const allVariants = [canonical, ...synonyms];
            if (allVariants.includes(skill)) {
                for (const variant of allVariants) {
                    if (text.includes(variant)) {
                        return { match: true, confidence: 0.9, type: 'synonym' };
                    }
                }
            }
        }
        
        // Fuzzy match (only for skills longer than 3 chars to avoid false positives)
        if (skill.length > 3) {
            const words = text.split(/\s+/);
            for (const word of words) {
                if (word.length > 3 && this.stringSimilarity(skill, word) > 0.8) {
                    return { match: true, confidence: 0.7, type: 'fuzzy' };
                }
            }
        }
        
        return { match: false, confidence: 0, type: null };
    }

    // Normalize a skill to its canonical form
    normalizeSkill(skill) {
        const skillLower = skill.toLowerCase().trim();
        for (const [canonical, synonyms] of Object.entries(this.skillSynonyms)) {
            if (canonical === skillLower || synonyms.includes(skillLower)) {
                return canonical;
            }
        }
        return skillLower;
    }

    // Calculate distance between two coordinates using Haversine formula (returns miles)
    haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Parse location string and find coordinates
    getLocationCoordinates(locationString) {
        if (!locationString) return null;
        
        const locationLower = locationString.toLowerCase();
        
        // Check for exact city matches first
        for (const [city, coords] of Object.entries(this.cityCoordinates)) {
            if (locationLower.includes(city)) {
                return { city, ...coords };
            }
        }
        
        // Check hub city aliases
        for (const [hubCity, hubData] of Object.entries(this.hubCities)) {
            if (locationLower.includes(hubCity)) {
                return { city: hubCity, lat: hubData.lat, lng: hubData.lng };
            }
            for (const alias of hubData.aliases) {
                if (locationLower.includes(alias)) {
                    return { city: alias, lat: hubData.lat, lng: hubData.lng };
                }
            }
        }
        
        return null;
    }

    // Check if a location is within 30 miles of any hub city
    isWithinHubRadius(jobLocation, radiusMiles = 30) {
        const jobCoords = this.getLocationCoordinates(jobLocation);
        if (!jobCoords) return { isWithin: false, nearestHub: null, distance: null };
        
        let nearestHub = null;
        let minDistance = Infinity;
        
        for (const [hubName, hubData] of Object.entries(this.hubCities)) {
            const distance = this.haversineDistance(
                jobCoords.lat, jobCoords.lng,
                hubData.lat, hubData.lng
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestHub = hubName;
            }
        }
        
        return {
            isWithin: minDistance <= radiusMiles,
            nearestHub: nearestHub,
            distance: Math.round(minDistance),
            jobCity: jobCoords.city
        };
    }

    // Extract keywords from text with TF weighting
    extractKeywords(text) {
        if (!text) return [];
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'our', 'your', 'their', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once']);
        
        const words = text.toLowerCase()
            .replace(/[^\w\s+#.-]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word));
        
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        return Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([word, count]) => ({ word, count, weight: count / words.length }));
    }

    async fetchJobs() {
        try {
            const response = await fetch('https://boards-api.greenhouse.io/v1/boards/klaviyo/jobs');
            const data = await response.json();
            this.jobs = data.jobs || [];
            console.log(`Loaded ${this.jobs.length} jobs from Klaviyo`);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            this.jobs = [];
        }
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('candidate-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Search functionality
        const searchInput = document.getElementById('search-jobs');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Sort and filter for results
        const sortSelect = document.getElementById('sort-by');
        sortSelect.addEventListener('change', () => this.sortResults());

        const locationFilter = document.getElementById('filter-location');
        locationFilter.addEventListener('change', () => this.filterResults());

        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        loadMoreBtn.addEventListener('click', () => this.loadMoreJobs());

        // Modal close
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');
        modalClose.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', () => this.closeModal());

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Department filter buttons
        document.getElementById('department-filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleDepartmentFilter(e.target);
            }
        });

        // "Open to Anything" checkbox behavior
        const deptCheckboxes = document.querySelectorAll('input[name="departments"]');
        deptCheckboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.value === 'any' && e.target.checked) {
                    deptCheckboxes.forEach(other => {
                        if (other.value !== 'any') other.checked = false;
                    });
                } else if (e.target.value !== 'any' && e.target.checked) {
                    const anyCheckbox = document.querySelector('input[name="departments"][value="any"]');
                    anyCheckbox.checked = false;
                }
            });
        });

        // Same for locations
        const locCheckboxes = document.querySelectorAll('input[name="locations"]');
        locCheckboxes.forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.value === 'any' && e.target.checked) {
                    locCheckboxes.forEach(other => {
                        if (other.value !== 'any') other.checked = false;
                    });
                } else if (e.target.value !== 'any' && e.target.checked) {
                    const anyCheckbox = document.querySelector('input[name="locations"][value="any"]');
                    anyCheckbox.checked = false;
                }
            });
        });

        // Resume upload functionality
        this.setupResumeUpload();

        // "How did you hear about us" conditional fields
        this.setupHearAboutField();
    }

    setupResumeUpload() {
        const dropzone = document.getElementById('resume-dropzone');
        const fileInput = document.getElementById('resume-input');
        const uploadedSection = document.getElementById('resume-uploaded');
        const removeBtn = document.getElementById('remove-resume');

        // Click to upload
        dropzone.addEventListener('click', () => fileInput.click());

        // Drag and drop events
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleResumeFile(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleResumeFile(e.target.files[0]);
            }
        });

        // Remove resume
        removeBtn.addEventListener('click', () => {
            this.removeResume();
        });
    }

    async handleResumeFile(file) {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            alert('Please upload a PDF, DOC, DOCX, or TXT file.');
            return;
        }

        // Show uploaded state
        const dropzone = document.getElementById('resume-dropzone');
        const uploadedSection = document.getElementById('resume-uploaded');
        const filenameSpan = document.getElementById('uploaded-filename');
        const parsingStatus = document.getElementById('parsing-status');
        const parsingSuccess = document.getElementById('parsing-success');

        dropzone.classList.add('hidden');
        uploadedSection.classList.remove('hidden');
        filenameSpan.textContent = file.name;
        parsingStatus.classList.remove('hidden');
        parsingSuccess.classList.add('hidden');

        // Parse the resume
        try {
            const text = await this.extractTextFromFile(file);
            await this.autoFillFromResume(text);
            
            // Show success
            parsingStatus.classList.add('hidden');
            parsingSuccess.classList.remove('hidden');
        } catch (error) {
            console.error('Error parsing resume:', error);
            parsingStatus.innerHTML = '<span style="color: var(--coral);">Could not parse resume. Please fill in manually.</span>';
        }
    }

    async extractTextFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                const content = e.target.result;
                
                if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                    resolve(content);
                } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                    try {
                        const text = await this.extractTextFromPDF(content);
                        resolve(text);
                    } catch (err) {
                        console.error('PDF parsing error:', err);
                        resolve(this.extractBasicText(content));
                    }
                } else {
                    // For DOC/DOCX, extract what text we can
                    resolve(this.extractBasicText(content));
                }
            };
            
            reader.onerror = () => reject(reader.error);
            
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    async extractTextFromPDF(arrayBuffer) {
        // Use PDF.js for proper PDF text extraction
        if (typeof pdfjsLib === 'undefined') {
            console.error('PDF.js library not loaded');
            return this.extractBasicText(arrayBuffer);
        }

        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        try {
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            console.log(`PDF loaded: ${pdf.numPages} pages`);
            
            let fullText = '';
            
            // Extract text from each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Combine text items with proper spacing
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ');
                
                fullText += pageText + '\n';
            }
            
            console.log('PDF text extracted successfully');
            console.log('Extracted text preview:', fullText.substring(0, 300));
            
            return fullText;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw error;
        }
    }

    extractBasicText(content) {
        // Try to extract any readable text from binary content
        if (typeof content === 'string') return content;
        
        const uint8Array = new Uint8Array(content);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawText = decoder.decode(uint8Array);
        
        // Filter to readable characters
        return rawText.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ');
    }

    async autoFillFromResume(text) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('=== Resume Text Extracted ===');
        console.log('Text length:', text.length);
        console.log('First 500 chars:', text.substring(0, 500));
        console.log('=============================');

        const textLower = text.toLowerCase();

        // Extract email
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
            console.log('Found email:', emailMatch[0]);
            this.setFieldValue('email', emailMatch[0]);
        }

        // Try to extract name using multiple strategies
        let nameFound = false;
        
        // Words that are NOT names (companies, universities, cities, titles, etc.)
        const notNames = new Set([
            // Companies
            'bain', 'mckinsey', 'bcg', 'boston', 'consulting', 'group', 'company', 'capital', 'partners',
            'deloitte', 'accenture', 'kpmg', 'ernst', 'young', 'pwc', 'amazon', 'google', 'meta', 'apple',
            'microsoft', 'salesforce', 'hubspot', 'klaviyo', 'stripe', 'uber', 'airbnb', 'netflix',
            // Universities
            'university', 'college', 'institute', 'school', 'harvard', 'stanford', 'yale', 'princeton',
            'columbia', 'wharton', 'berkeley', 'mit', 'northwestern', 'duke', 'cornell',
            // Cities/Locations
            'new', 'york', 'san', 'francisco', 'los', 'angeles', 'chicago', 'boston', 'seattle', 'denver',
            'london', 'paris', 'sydney', 'singapore', 'dublin',
            // Job titles
            'senior', 'junior', 'associate', 'manager', 'director', 'analyst', 'consultant', 'engineer',
            'specialist', 'coordinator', 'executive', 'president', 'officer', 'lead', 'head',
            // Resume sections
            'experience', 'education', 'skills', 'summary', 'objective', 'profile', 'contact', 'references',
            // Other common false positives
            'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 
            'october', 'november', 'december', 'present', 'current'
        ]);
        
        // Helper function to check if a word could be a name
        const couldBeName = (word) => {
            if (!word || word.length < 2) return false;
            const lower = word.toLowerCase();
            if (notNames.has(lower)) return false;
            if (!/^[A-Za-z]/.test(word)) return false;
            if (/[0-9@]/.test(word)) return false;
            return true;
        };

        // Strategy 1: Look at first few lines for name (most reliable for resumes)
        const lines = text.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0);
        console.log('First 5 lines:', lines.slice(0, 5));
        
        for (const line of lines.slice(0, 15)) {
            // Skip lines with emails, phone numbers, URLs, or common headers
            if (line.includes('@') || 
                line.includes('http') ||
                line.match(/^\d/) || 
                line.match(/resume|curriculum|vitae|objective|summary|experience|education|skills|profile/i) ||
                line.length > 50 ||
                line.length < 3) {
                continue;
            }

            // Clean the line and look for name-like words
            const cleanLine = line.replace(/[^\w\s'-]/g, '').trim();
            const words = cleanLine.split(/\s+/);
            const nameParts = words.filter(couldBeName);

            // A name should have 2-4 parts (First Last or First Middle Last)
            if (nameParts.length >= 2 && nameParts.length <= 4) {
                // Extra validation: first part shouldn't be a common company word
                const firstName = nameParts[0];
                const lastName = nameParts[nameParts.length - 1];
                
                // Check that it looks like a real name (first letter uppercase, rest lowercase typical)
                if (firstName.length >= 2 && lastName.length >= 2) {
                    console.log('Found name (line scan):', nameParts, 'from line:', line);
                    this.setFieldValue('firstName', this.capitalize(firstName));
                    this.setFieldValue('lastName', this.capitalize(lastName));
                    nameFound = true;
                    break;
                }
            }
        }

        // Strategy 2: Look for name near email (often "Name | email" or "Name - email")
        if (!nameFound && emailMatch) {
            const emailIndex = text.indexOf(emailMatch[0]);
            const textBeforeEmail = text.substring(Math.max(0, emailIndex - 150), emailIndex);
            const lineBeforeEmail = textBeforeEmail.split(/[\n\r]/).pop()?.trim();
            
            if (lineBeforeEmail) {
                const parts = lineBeforeEmail.split(/[\s|•\-–—,]+/).filter(couldBeName);
                if (parts.length >= 2 && parts.length <= 4) {
                    console.log('Found name (near email):', parts);
                    this.setFieldValue('firstName', this.capitalize(parts[0]));
                    this.setFieldValue('lastName', this.capitalize(parts[parts.length - 1]));
                    nameFound = true;
                }
            }
        }

        // Strategy 3: Pattern match as last resort (look for "FirstName LastName" pattern)
        if (!nameFound) {
            const namePattern = /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g;
            let match;
            while ((match = namePattern.exec(text)) !== null) {
                const [fullMatch, first, last] = match;
                if (couldBeName(first) && couldBeName(last) && !fullMatch.includes('@')) {
                    console.log('Found name (pattern match):', first, last);
                    this.setFieldValue('firstName', first);
                    this.setFieldValue('lastName', last);
                    nameFound = true;
                    break;
                }
            }
        }

        if (!nameFound) {
            console.log('Could not extract name from resume');
        }

        // ===== PHONE NUMBER EXTRACTION =====
        console.log('--- Extracting phone number ---');
        const phonePatterns = [
            /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,           // (123) 456-7890 or 123-456-7890
            /\+1[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, // +1 (123) 456-7890
            /\+\d{1,3}[\s.-]?\d{9,}/g,                         // International +44 1234567890
            /\d{3}[\s.-]\d{3}[\s.-]\d{4}/g,                   // 123.456.7890 or 123 456 7890
            /\d{10,11}/g                                       // 1234567890
        ];
        
        let phoneFound = false;
        for (const pattern of phonePatterns) {
            const matches = text.match(pattern);
            if (matches && matches.length > 0) {
                // Filter out numbers that look like dates or years
                const validPhone = matches.find(m => !m.match(/^(19|20)\d{2}/) && m.replace(/\D/g, '').length >= 10);
                if (validPhone) {
                    console.log('Found phone:', validPhone);
                    this.setFieldValue('phone', validPhone);
                    phoneFound = true;
                    break;
                }
            }
        }
        if (!phoneFound) {
            console.log('No phone number found');
        }

        // ===== SKILLS EXTRACTION =====
        console.log('--- Extracting skills ---');
        const skillKeywords = [
            'python', 'javascript', 'typescript', 'java', 'sql', 'react', 'node.js', 'nodejs', 'aws', 'gcp', 'azure',
            'data analysis', 'machine learning', 'ai', 'artificial intelligence', 'project management', 'agile', 'scrum',
            'salesforce', 'hubspot', 'klaviyo', 'marketing automation', 'seo', 'sem', 'analytics', 'tableau', 'excel', 'powerpoint',
            'communication', 'leadership', 'strategy', 'strategic planning', 'finance', 'accounting', 'budgeting', 'forecasting',
            'customer success', 'account management', 'sales', 'negotiation', 'crm', 'b2b', 'b2c', 'saas',
            'html', 'css', 'git', 'docker', 'kubernetes', 'ci/cd', 'api', 'rest', 'graphql',
            'fp&a', 'financial planning', 'variance analysis', 'modeling', 'p&l', 'revenue', 'kpis',
            'product management', 'roadmap', 'user research', 'a/b testing', 'ux', 'ui', 'figma',
            'recruiting', 'talent acquisition', 'hr', 'people operations', 'onboarding',
            'email marketing', 'content marketing', 'digital marketing', 'paid media', 'social media',
            'customer support', 'technical support', 'implementation', 'consulting'
        ];

        const foundSkills = skillKeywords.filter(skill => textLower.includes(skill.toLowerCase()));
        if (foundSkills.length > 0) {
            console.log('Found skills:', foundSkills);
            this.setFieldValue('skills', foundSkills.join(', '));
        }

        // ===== EXPERIENCE LEVEL DETECTION =====
        console.log('--- Detecting experience level ---');
        let experienceSet = false;
        
        // Method 1: Look for years in job history (e.g., "2018 - 2023" or "2018 - Present")
        const yearRanges = text.match(/(19|20)\d{2}\s*[-–—to]+\s*((19|20)\d{2}|present|current|now)/gi) || [];
        console.log('Year ranges found:', yearRanges);
        
        if (yearRanges.length > 0) {
            const currentYear = new Date().getFullYear();
            let totalYears = 0;
            
            yearRanges.forEach(range => {
                const years = range.match(/(19|20)\d{2}/g);
                if (years && years.length >= 1) {
                    const startYear = parseInt(years[0]);
                    const endYear = years.length > 1 ? parseInt(years[1]) : currentYear;
                    totalYears += (endYear - startYear);
                }
            });
            
            // Also check if "Present" or "Current" is in any range
            const hasCurrentJob = yearRanges.some(range => 
                range.toLowerCase().includes('present') || range.toLowerCase().includes('current')
            );
            if (hasCurrentJob) {
                const firstYear = yearRanges[0]?.match(/(19|20)\d{2}/);
                if (firstYear) {
                    totalYears = Math.max(totalYears, currentYear - parseInt(firstYear[0]));
                }
            }
            
            console.log('Estimated total years of experience:', totalYears);
            
            if (totalYears >= 12) {
                this.setFieldValue('experience', '12+');
                experienceSet = true;
            } else if (totalYears >= 8) {
                this.setFieldValue('experience', '8-12');
                experienceSet = true;
            } else if (totalYears >= 5) {
                this.setFieldValue('experience', '5-8');
                experienceSet = true;
            } else if (totalYears >= 2) {
                this.setFieldValue('experience', '2-5');
                experienceSet = true;
            } else if (totalYears >= 0) {
                this.setFieldValue('experience', '0-2');
                experienceSet = true;
            }
        }
        
        // Method 2: Fallback to title-based detection
        if (!experienceSet) {
            if (textLower.includes('director') || textLower.includes('vp ') || textLower.includes('vice president') || 
                textLower.includes('head of') || textLower.includes('chief ') || textLower.includes('cfo') || 
                textLower.includes('cto') || textLower.includes('cmo')) {
                this.setFieldValue('experience', '12+');
                console.log('Experience set based on title: 12+');
            } else if (textLower.includes('senior manager') || textLower.includes('principal') || 
                       textLower.includes('staff ') || textLower.includes('sr. manager')) {
                this.setFieldValue('experience', '8-12');
                console.log('Experience set based on title: 8-12');
            } else if (textLower.includes('senior ') || textLower.includes('sr. ') || textLower.includes('sr ') ||
                       textLower.includes('lead ') || textLower.includes(' lead') || textLower.includes('manager')) {
                this.setFieldValue('experience', '5-8');
                console.log('Experience set based on title: 5-8');
            } else if (textLower.includes('associate') || textLower.includes('junior') || 
                       textLower.includes('entry') || textLower.includes('intern') || textLower.includes('analyst')) {
                this.setFieldValue('experience', '0-2');
                console.log('Experience set based on title: 0-2');
            } else {
                // Default to mid-level if we can't determine
                this.setFieldValue('experience', '2-5');
                console.log('Experience set to default: 2-5');
            }
        }

        // ===== DEPARTMENT/ROLE INTEREST DETECTION =====
        console.log('--- Detecting department interests ---');
        
        // Check for consulting/strategy background FIRST (to avoid misclassification)
        const consultingKeywords = ['bain', 'mckinsey', 'bcg', 'boston consulting', 'deloitte consulting', 
            'accenture strategy', 'kearney', 'oliver wyman', 'roland berger', 'strategy&', 'lek consulting',
            'management consultant', 'strategy consultant', 'consulting firm', 'engagement manager',
            'case interview', 'client engagement', 'workstream', 'due diligence', 'm&a advisory'];
        
        const isConsultingBackground = consultingKeywords.some(kw => textLower.includes(kw.toLowerCase()));
        if (isConsultingBackground) {
            console.log('Detected consulting/strategy background - adjusting department detection');
        }
        
        const deptMappings = {
            'engineering': ['software engineer', 'developer', 'programming', 'coding', 'backend', 'frontend', 'full stack', 
                           'devops', 'infrastructure', 'platform engineer', 'computer science', 'github', 'code review'],
            'product': ['product manager', 'product management', 'roadmap', 'user stories', 'product owner', 
                       'product strategy', 'product development', 'backlog', 'sprint planning', 'product lead'],
            'design': ['designer', 'ux design', 'ui design', 'user experience', 'figma', 'sketch', 'adobe', 'prototyping',
                      'visual design', 'interaction design', 'design system', 'wireframe'],
            'sales': ['sales representative', 'account executive', 'sales development', 'bdr', 'sdr', 'quota', 'pipeline', 
                     'closing deals', 'sales territory', 'enterprise sales', 'saas sales', 'sales quota'],
            'marketing': ['marketing manager', 'marketing campaign', 'brand marketing', 'content marketing', 'demand gen', 
                         'seo specialist', 'sem ', 'paid media', 'email marketing', 'digital marketing', 
                         'growth marketing', 'marketing automation', 'marketing strategy', 'campaign manager'],
            'customer-success': ['customer success', 'csm', 'retention', 'onboarding specialist', 'customer support', 'support specialist',
                                'client success', 'renewals', 'churn', 'nps', 'customer experience'],
            'finance': ['finance', 'fp&a', 'accounting', 'budget', 'financial analysis', 'forecasting', 'variance',
                       'financial planning', 'controller', 'treasury', 'audit', 'revenue recognition', 'gaap', 'cpa'],
            'hr': ['human resources', 'hr manager', 'recruiting', 'talent acquisition', 'people operations', 'hrbp',
                  'compensation', 'benefits', 'employee relations', 'talent management', 'learning and development'],
            'data': ['data analyst', 'data science', 'data analytics', 'business intelligence', 'bi analyst', 'tableau', 
                    'data engineer', 'machine learning engineer', 'statistical analysis', 'sql developer', 'etl', 'data warehouse'],
            'operations': ['operations manager', 'business operations', 'process improvement', 'project manager', 'pmo', 'supply chain',
                          'logistics', 'vendor management', 'procurement', 'strategy operations', 
                          'management consulting', 'strategy consulting', 'consultant', 'bain', 'mckinsey', 'bcg'],
            'security': ['security engineer', 'cybersecurity', 'infosec', 'compliance officer', 'risk management', 'soc analyst', 
                        'penetration testing', 'vulnerability', 'information security']
        };
        
        // If consulting background detected, prioritize operations/strategy over marketing
        if (isConsultingBackground) {
            // Check operations first for consultants
            const opsCheckbox = document.querySelector('input[name="departments"][value="operations"]');
            if (opsCheckbox && !opsCheckbox.checked) {
                opsCheckbox.checked = true;
                console.log('Selected department: operations (consulting background detected)');
            }
        }

        let deptFound = isConsultingBackground; // Already found if consulting background
        
        // Score each department and pick the best matches
        const deptScores = [];
        for (const [dept, keywords] of Object.entries(deptMappings)) {
            // Skip marketing for consulting backgrounds (too many false positives)
            if (isConsultingBackground && dept === 'marketing') {
                // Only match marketing if very explicit marketing keywords found
                const explicitMarketingKeywords = ['marketing manager', 'marketing director', 'cmo', 'vp marketing', 
                    'head of marketing', 'marketing team', 'marketing department'];
                const hasExplicitMarketing = explicitMarketingKeywords.some(kw => textLower.includes(kw));
                if (!hasExplicitMarketing) {
                    console.log('Skipping marketing for consulting background (no explicit marketing role found)');
                    continue;
                }
            }
            
            const matchCount = keywords.filter(kw => textLower.includes(kw.toLowerCase())).length;
            if (matchCount > 0) {
                deptScores.push({ dept, matchCount, keywords: keywords.filter(kw => textLower.includes(kw.toLowerCase())) });
            }
        }
        
        // Sort by match count and select top departments (require at least 2 matches for confidence)
        deptScores.sort((a, b) => b.matchCount - a.matchCount);
        console.log('Department scores:', deptScores.map(d => `${d.dept}: ${d.matchCount} matches`));
        
        for (const { dept, matchCount, keywords } of deptScores) {
            if (matchCount >= 2) {
                const checkbox = document.querySelector(`input[name="departments"][value="${dept}"]`);
                if (checkbox && !checkbox.checked) {
                    checkbox.checked = true;
                    console.log(`Selected department: ${dept} (${matchCount} keyword matches: ${keywords.join(', ')})`);
                    deptFound = true;
                }
            }
        }
        
        // If no strong matches, try the top single keyword match
        if (!deptFound && deptScores.length > 0) {
            const topDept = deptScores[0];
            const checkbox = document.querySelector(`input[name="departments"][value="${topDept.dept}"]`);
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                console.log(`Selected department (best single match): ${topDept.dept}`);
                deptFound = true;
            }
        }

        // ===== LOCATION DETECTION =====
        console.log('--- Detecting location preferences ---');
        const locationMappings = {
            'Boston, MA': ['boston', ' ma ', ' ma,', 'massachusetts', 'cambridge, ma', 'somerville'],
            'San Francisco, CA': ['san francisco', ' sf ', 'bay area', 'palo alto', 'mountain view', 'san jose', 'silicon valley', 'oakland'],
            'Denver, CO': ['denver', 'colorado', ' co ', 'boulder'],
            'London, UK': ['london', 'united kingdom', ' uk ', 'england'],
            'Dublin, IE': ['dublin', 'ireland'],
            'Sydney, AU': ['sydney', 'australia', 'melbourne', 'brisbane'],
            'Singapore': ['singapore']
        };

        let locationFound = false;
        for (const [loc, keywords] of Object.entries(locationMappings)) {
            if (keywords.some(kw => textLower.includes(kw.toLowerCase()))) {
                const checkbox = document.querySelector(`input[name="locations"][value="${loc}"]`);
                if (checkbox && !checkbox.checked) {
                    checkbox.checked = true;
                    console.log(`Selected location: ${loc}`);
                    locationFound = true;
                }
            }
        }

        // If no specific location found, check for remote/flexible preferences
        if (!locationFound) {
            if (textLower.includes('remote') || textLower.includes('work from home') || textLower.includes('distributed')) {
                const anyCheckbox = document.querySelector('input[name="locations"][value="any"]');
                if (anyCheckbox) {
                    anyCheckbox.checked = true;
                    console.log('Selected: Open to Any Location (remote preference detected)');
                }
            }
        }

        console.log('=== Resume parsing complete ===');
    }

    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field && value) {
            field.value = value;
            field.classList.add('auto-filled');
            setTimeout(() => field.classList.remove('auto-filled'), 2000);
        }
    }

    removeResume() {
        const dropzone = document.getElementById('resume-dropzone');
        const uploadedSection = document.getElementById('resume-uploaded');
        const fileInput = document.getElementById('resume-input');
        const parsingStatus = document.getElementById('parsing-status');
        const parsingSuccess = document.getElementById('parsing-success');

        dropzone.classList.remove('hidden');
        uploadedSection.classList.add('hidden');
        fileInput.value = '';
        parsingStatus.classList.remove('hidden');
        parsingSuccess.classList.add('hidden');
        parsingStatus.innerHTML = '<span class="parsing-spinner"></span><span>Analyzing resume...</span>';
    }

    setupHearAboutField() {
        const hearAboutSelect = document.getElementById('hearAbout');
        const referralDetails = document.getElementById('referral-details');
        const otherDetails = document.getElementById('other-source-details');
        const referrerNameInput = document.getElementById('referrerName');
        const otherSourceInput = document.getElementById('otherSource');

        hearAboutSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            
            // Hide all conditional fields first
            referralDetails.classList.add('hidden');
            otherDetails.classList.add('hidden');
            referrerNameInput.required = false;

            if (value === 'referral') {
                referralDetails.classList.remove('hidden');
                referrerNameInput.required = true;
                referrerNameInput.focus();
            } else if (value === 'other') {
                otherDetails.classList.remove('hidden');
                otherSourceInput.focus();
            }
        });
    }

    updateStats() {
        const totalJobsEl = document.getElementById('total-jobs');
        const totalLocationsEl = document.getElementById('total-locations');
        const totalDepartmentsEl = document.getElementById('total-departments');
        const allRolesCountEl = document.getElementById('all-roles-count');

        // Count unique locations
        const locations = new Set(this.jobs.map(job => job.location?.name).filter(Boolean));
        
        // Count unique departments (extracted from titles/keywords)
        const departments = this.extractDepartments();

        totalJobsEl.textContent = this.jobs.length;
        totalLocationsEl.textContent = locations.size;
        totalDepartmentsEl.textContent = departments.size;
        allRolesCountEl.textContent = this.jobs.length;

        // Animate numbers
        this.animateNumber(totalJobsEl, this.jobs.length);
        this.animateNumber(totalLocationsEl, locations.size);
        this.animateNumber(totalDepartmentsEl, departments.size);
    }

    animateNumber(element, target) {
        let current = 0;
        const step = Math.ceil(target / 30);
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(interval);
            } else {
                element.textContent = current;
            }
        }, 30);
    }

    extractDepartments() {
        const deptKeywords = {
            'Engineering': ['engineer', 'developer', 'software', 'devops', 'infrastructure', 'platform', 'backend', 'frontend', 'full stack'],
            'Product': ['product manager', 'product design', 'pm'],
            'Design': ['designer', 'ux', 'ui', 'design'],
            'Sales': ['sales', 'account executive', 'bdr', 'business development', 'ae'],
            'Marketing': ['marketing', 'brand', 'content', 'demand gen', 'growth'],
            'Customer Success': ['customer success', 'csm', 'customer support', 'support specialist'],
            'Finance': ['finance', 'fp&a', 'accounting', 'financial'],
            'People/HR': ['talent', 'recruiting', 'hr', 'people', 'learning'],
            'Data': ['data', 'analytics', 'bi', 'intelligence'],
            'Operations': ['operations', 'ops', 'procurement'],
            'Security': ['security', 'seceng', 'compliance']
        };

        const foundDepts = new Set();
        this.jobs.forEach(job => {
            const title = job.title?.toLowerCase() || '';
            for (const [dept, keywords] of Object.entries(deptKeywords)) {
                if (keywords.some(kw => title.includes(kw))) {
                    foundDepts.add(dept);
                    break;
                }
            }
        });

        return foundDepts;
    }

    populateFilters() {
        // Populate location filter dropdown
        const locationFilter = document.getElementById('filter-location');
        const locations = [...new Set(this.jobs.map(job => job.location?.name).filter(Boolean))].sort();
        
        locations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc;
            option.textContent = loc;
            locationFilter.appendChild(option);
        });

        // Create department filter buttons
        const filterContainer = document.getElementById('department-filters');
        const departments = ['Engineering', 'Sales', 'Marketing', 'Product', 'Customer Success', 'Finance', 'Data'];
        
        departments.forEach(dept => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.filter = dept.toLowerCase();
            btn.textContent = dept;
            filterContainer.appendChild(btn);
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        // Collect form data
        const formData = new FormData(e.target);
        
        this.candidateProfile = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            experience: formData.get('experience'),
            departments: formData.getAll('departments'),
            locations: formData.getAll('locations'),
            skills: formData.get('skills')?.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) || [],
            about: formData.get('about'),
            hearAbout: formData.get('hearAbout'),
            referrerName: formData.get('referrerName'),
            otherSource: formData.get('otherSource'),
            emailSubscribe: formData.get('emailSubscribe') === 'yes'
        };

        // Log the candidate profile for debugging/tracking
        console.log('Candidate Profile:', this.candidateProfile);

        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Calculate matches
        this.matchedJobs = this.calculateMatches();

        // Reset button
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');

        // Show results
        this.displayResults();
        
        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }

    calculateMatches() {
        console.log('=== Starting Enhanced Job Matching ===');
        console.log('Candidate Profile:', this.candidateProfile);

        const matches = this.jobs.map(job => {
            const scoreBreakdown = {
                location: { score: 0, max: this.scoringWeights.location, details: [] },
                department: { score: 0, max: this.scoringWeights.department, details: [] },
                experience: { score: 0, max: this.scoringWeights.experience, details: [] },
                skills: { score: 0, max: this.scoringWeights.skills, details: [] },
                keywordRelevance: { score: 0, max: this.scoringWeights.keywordRelevance, details: [] }
            };

            const title = job.title?.toLowerCase() || '';
            const location = job.location?.name || '';
            const content = job.content?.toLowerCase() || '';
            const fullText = `${title} ${content}`;

            // ========== 1. LOCATION SCORING ==========
            const locationScore = this.calculateLocationScore(location, scoreBreakdown);

            // ========== 2. DEPARTMENT SCORING ==========
            const departmentScore = this.calculateDepartmentScore(title, content, scoreBreakdown);

            // ========== 3. EXPERIENCE LEVEL SCORING ==========
            const experienceScore = this.calculateExperienceScore(title, content, scoreBreakdown);

            // ========== 4. SKILLS SCORING (Enhanced) ==========
            const skillsScore = this.calculateSkillsScore(fullText, scoreBreakdown);

            // ========== 5. KEYWORD RELEVANCE SCORING ==========
            const keywordScore = this.calculateKeywordRelevanceScore(fullText, scoreBreakdown);

            // Calculate total score (normalized to 100)
            const totalScore = Math.round(
                scoreBreakdown.location.score +
                scoreBreakdown.department.score +
                scoreBreakdown.experience.score +
                scoreBreakdown.skills.score +
                scoreBreakdown.keywordRelevance.score
            );

            // Determine match quality tier
            const matchTier = this.getMatchTier(totalScore);

            // Compile match reasons (include all categories that contributed to score)
            const reasons = [];
            Object.entries(scoreBreakdown).forEach(([category, data]) => {
                if (data.score > 0 && data.details.length > 0) {
                    reasons.push(...data.details);
                }
            });

            // Debug logging for each job
            if (totalScore > 0) {
                console.log(`Job: ${job.title} | Score: ${totalScore} | Reasons:`, reasons, '| Breakdown:', {
                    location: scoreBreakdown.location.score,
                    department: scoreBreakdown.department.score,
                    experience: scoreBreakdown.experience.score,
                    skills: scoreBreakdown.skills.score,
                    keywords: scoreBreakdown.keywordRelevance.score
                });
            }

            return {
                ...job,
                matchScore: totalScore,
                matchTier: matchTier,
                matchReasons: reasons,
                scoreBreakdown: scoreBreakdown
            };
        });

        // Sort by match score (descending)
        const sortedMatches = matches
            .filter(job => job.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore);

        console.log(`=== Matching Complete: ${sortedMatches.length} jobs matched ===`);
        if (sortedMatches.length > 0) {
            console.log('Top 3 matches:', sortedMatches.slice(0, 3).map(j => ({
                title: j.title,
                score: j.matchScore,
                tier: j.matchTier
            })));
        }

        return sortedMatches;
    }

    calculateLocationScore(jobLocation, scoreBreakdown) {
        const maxScore = this.scoringWeights.location; // 15 points
        
        // Binary scoring: 15 points if within 30 miles of a hub city, 0 otherwise
        const hubCheck = this.isWithinHubRadius(jobLocation, 30);
        
        if (hubCheck.isWithin) {
            scoreBreakdown.location.score = maxScore;
            const hubName = this.capitalize(hubCheck.nearestHub);
            if (hubCheck.distance === 0 || hubCheck.jobCity === hubCheck.nearestHub) {
                scoreBreakdown.location.details.push(`Hub: ${hubName}`);
            } else {
                scoreBreakdown.location.details.push(`Near ${hubName} (${hubCheck.distance}mi)`);
            }
            return maxScore;
        }
        
        // Check if it's a remote position (still give points as remote can work from hub cities)
        const jobLocationLower = jobLocation.toLowerCase();
        if (jobLocationLower.includes('remote') || jobLocationLower.includes('anywhere') || jobLocationLower.includes('work from home')) {
            scoreBreakdown.location.score = maxScore;
            scoreBreakdown.location.details.push('Remote (hub-eligible)');
            return maxScore;
        }

        // No points if not within 30 miles of a hub
        return 0;
    }

    calculateDepartmentScore(title, content, scoreBreakdown) {
        const maxScore = this.scoringWeights.department; // 25 points
        
        if (this.candidateProfile.departments.includes('any')) {
            scoreBreakdown.department.score = maxScore * 0.6;
            scoreBreakdown.department.details.push('Open to any department');
            return scoreBreakdown.department.score;
        }

        const fullText = `${title} ${content}`.toLowerCase();
        let bestMatch = { 
            parentDept: null, 
            subdept: null, 
            confidence: 0 
        };

        // Check each department the candidate is interested in
        for (const prefDept of this.candidateProfile.departments) {
            const subdepartments = this.departmentMappings[prefDept];
            if (!subdepartments) continue;

            // Check each subdepartment for matches
            for (const [subdeptName, keywords] of Object.entries(subdepartments)) {
                for (const keyword of keywords) {
                    if (fullText.includes(keyword.toLowerCase())) {
                        // Found a match - this is high confidence (specific subdepartment match)
                        if (bestMatch.confidence < 1) {
                            bestMatch = {
                                parentDept: prefDept,
                                subdept: subdeptName,
                                confidence: 1,
                                matchedKeyword: keyword
                            };
                        }
                        break; // Found match for this subdept, move to next
                    }
                }
            }

            // If no specific subdepartment match, check for general department keywords
            if (bestMatch.confidence < 0.6) {
                const generalKeywords = this.getGeneralDepartmentKeywords(prefDept);
                const matchCount = generalKeywords.filter(kw => fullText.includes(kw.toLowerCase())).length;
                
                if (matchCount >= 2 && bestMatch.confidence < 0.6) {
                    bestMatch = {
                        parentDept: prefDept,
                        subdept: null,
                        confidence: 0.6
                    };
                } else if (matchCount === 1 && bestMatch.confidence < 0.4) {
                    bestMatch = {
                        parentDept: prefDept,
                        subdept: null,
                        confidence: 0.4
                    };
                }
            }
        }

        if (bestMatch.parentDept) {
            scoreBreakdown.department.score = maxScore * bestMatch.confidence;
            
            if (bestMatch.subdept) {
                // Granular match: "Finance - Procurement"
                scoreBreakdown.department.details.push(bestMatch.subdept);
            } else {
                // General department match
                const deptName = this.capitalize(bestMatch.parentDept.replace('-', ' '));
                scoreBreakdown.department.details.push(`${deptName} (general)`);
            }
        }

        return scoreBreakdown.department.score;
    }

    // Get general keywords for a department (fallback matching)
    getGeneralDepartmentKeywords(dept) {
        const generalKeywords = {
            'engineering': ['engineer', 'developer', 'software', 'technical', 'code'],
            'product': ['product', 'pm', 'roadmap'],
            'design': ['design', 'designer', 'ux', 'ui', 'creative'],
            'sales': ['sales', 'account', 'revenue', 'business development'],
            'marketing': ['marketing', 'brand', 'content', 'growth', 'campaign'],
            'customer-success': ['customer', 'success', 'support', 'implementation'],
            'finance': ['finance', 'financial', 'accounting', 'fp&a', 'budget', 'procurement'],
            'hr': ['talent', 'recruiting', 'people', 'hr', 'human resources'],
            'data': ['data', 'analytics', 'analyst', 'bi', 'intelligence'],
            'operations': ['operations', 'ops', 'program', 'project'],
            'security': ['security', 'compliance', 'risk', 'infosec'],
            'legal': ['legal', 'counsel', 'attorney', 'contracts']
        };
        return generalKeywords[dept] || [];
    }

    calculateExperienceScore(title, content, scoreBreakdown) {
        const maxScore = this.scoringWeights.experience;
        const candidateExp = this.candidateProfile.experience;
        
        if (!candidateExp) return 0;

        // Detect job's experience level
        const fullText = `${title} ${content}`;
        let detectedLevel = null;
        let highestWeight = 0;

        for (const [level, config] of Object.entries(this.experienceLevels)) {
            for (const pattern of config.patterns) {
                if (fullText.includes(pattern)) {
                    if (config.weight > highestWeight) {
                        highestWeight = config.weight;
                        detectedLevel = level;
                    }
                }
            }
        }

        if (!detectedLevel) {
            // Default to mid-level if no signals
            detectedLevel = 'mid';
            highestWeight = 2;
        }

        // Map candidate experience to weight
        const expWeightMap = { '0-2': 1, '2-5': 2, '5-8': 3, '8-12': 4, '12+': 5 };
        const candidateWeight = expWeightMap[candidateExp] || 2;

        // Calculate score based on how close the levels are
        const weightDiff = Math.abs(candidateWeight - highestWeight);
        
        if (weightDiff === 0) {
            scoreBreakdown.experience.score = maxScore;
            scoreBreakdown.experience.details.push('Experience level: Perfect match');
        } else if (weightDiff === 1) {
            scoreBreakdown.experience.score = maxScore * 0.7;
            scoreBreakdown.experience.details.push('Experience level: Close match');
        } else if (weightDiff === 2) {
            scoreBreakdown.experience.score = maxScore * 0.3;
            scoreBreakdown.experience.details.push('Experience level: Partial match');
        }
        // weightDiff > 2 = no points (too far off)

        return scoreBreakdown.experience.score;
    }

    calculateSkillsScore(fullText, scoreBreakdown) {
        const maxScore = this.scoringWeights.skills;
        const candidateSkills = this.candidateProfile.skills || [];
        
        if (candidateSkills.length === 0) return 0;

        const matchedSkills = [];
        let totalConfidence = 0;

        for (const skill of candidateSkills) {
            const result = this.skillMatches(skill, fullText);
            if (result.match) {
                matchedSkills.push({
                    skill: skill,
                    confidence: result.confidence,
                    type: result.type
                });
                totalConfidence += result.confidence;
            }
        }

        if (matchedSkills.length === 0) return 0;

        // Score based on percentage of skills matched, weighted by confidence
        const matchPercentage = totalConfidence / candidateSkills.length;
        scoreBreakdown.skills.score = maxScore * Math.min(matchPercentage, 1);

        // Create skill summary
        const exactMatches = matchedSkills.filter(s => s.type === 'exact').map(s => s.skill);
        const synonymMatches = matchedSkills.filter(s => s.type === 'synonym').map(s => s.skill);
        const fuzzyMatches = matchedSkills.filter(s => s.type === 'fuzzy').map(s => s.skill);

        if (exactMatches.length > 0) {
            scoreBreakdown.skills.details.push(`Skills: ${exactMatches.join(', ')}`);
        }
        if (synonymMatches.length > 0) {
            scoreBreakdown.skills.details.push(`Related skills: ${synonymMatches.join(', ')}`);
        }

        return scoreBreakdown.skills.score;
    }

    calculateKeywordRelevanceScore(fullText, scoreBreakdown) {
        const maxScore = this.scoringWeights.keywordRelevance;
        
        // Extract keywords from candidate's "about" section
        const aboutText = this.candidateProfile.about || '';
        if (!aboutText || aboutText.length < 20) return 0;

        const candidateKeywords = this.extractKeywords(aboutText);
        const jobKeywords = this.extractKeywords(fullText);

        if (candidateKeywords.length === 0 || jobKeywords.length === 0) return 0;

        // Find overlapping keywords
        const jobKeywordSet = new Set(jobKeywords.map(k => k.word));
        const matchingKeywords = candidateKeywords.filter(k => jobKeywordSet.has(k.word));

        if (matchingKeywords.length === 0) return 0;

        // Score based on weighted keyword overlap
        const totalWeight = candidateKeywords.reduce((sum, k) => sum + k.weight, 0);
        const matchWeight = matchingKeywords.reduce((sum, k) => sum + k.weight, 0);
        const overlapRatio = matchWeight / totalWeight;

        scoreBreakdown.keywordRelevance.score = maxScore * Math.min(overlapRatio * 2, 1); // Boost to reward any overlap

        if (matchingKeywords.length > 0) {
            const topMatches = matchingKeywords.slice(0, 3).map(k => k.word);
            scoreBreakdown.keywordRelevance.details.push(`Keywords: ${topMatches.join(', ')}`);
        }

        return scoreBreakdown.keywordRelevance.score;
    }

    getMatchTier(score) {
        if (score >= 80) return { name: 'Excellent', emoji: '🌟', color: '#10b981' };
        if (score >= 60) return { name: 'Strong', emoji: '⭐', color: '#3b82f6' };
        if (score >= 40) return { name: 'Good', emoji: '👍', color: '#8b5cf6' };
        if (score >= 20) return { name: 'Fair', emoji: '🔍', color: '#f59e0b' };
        return { name: 'Low', emoji: '📋', color: '#6b7280' };
    }

    matchDepartment(title) {
        const deptMappings = {
            'engineering': ['engineer', 'developer', 'software', 'devops', 'infrastructure', 'platform'],
            'product': ['product manager', 'product lead'],
            'design': ['designer', 'ux', 'ui'],
            'sales': ['sales', 'account executive', 'bdr', 'business development'],
            'marketing': ['marketing', 'brand', 'content', 'demand'],
            'customer-success': ['customer success', 'csm', 'support specialist', 'customer support'],
            'finance': ['finance', 'fp&a', 'financial', 'analyst'],
            'hr': ['talent', 'recruiting', 'hr', 'people', 'learning'],
            'data': ['data', 'analytics', 'bi'],
            'operations': ['operations', 'ops'],
            'security': ['security', 'seceng']
        };

        for (const [dept, keywords] of Object.entries(deptMappings)) {
            if (keywords.some(kw => title.includes(kw))) {
                return dept;
            }
        }
        return null;
    }

    matchExperience(title) {
        const exp = this.candidateProfile.experience;
        const titleLower = title.toLowerCase();

        const levelMappings = {
            '0-2': ['associate', 'junior', 'entry', 'specialist', 'coordinator', 'ii'],
            '2-5': ['ii', 'specialist', 'analyst', 'engineer ii'],
            '5-8': ['senior', 'sr.', 'sr ', 'lead'],
            '8-12': ['lead', 'staff', 'principal', 'manager'],
            '12+': ['director', 'head of', 'vp', 'senior director', 'senior manager']
        };

        const keywords = levelMappings[exp] || [];
        return keywords.some(kw => titleLower.includes(kw));
    }

    displayResults() {
        const resultsSection = document.getElementById('results-section');
        const resultsGrid = document.getElementById('results-grid');
        const noResults = document.getElementById('no-results');
        const matchCount = document.getElementById('match-count');
        const locationFilter = document.getElementById('filter-location');

        resultsSection.classList.remove('hidden');

        if (this.matchedJobs.length === 0) {
            resultsGrid.innerHTML = '';
            noResults.classList.remove('hidden');
            matchCount.textContent = '0';
            return;
        }

        noResults.classList.add('hidden');
        matchCount.textContent = this.matchedJobs.length;

        // Populate location filter for results
        locationFilter.innerHTML = '<option value="all">All Locations</option>';
        const matchedLocations = [...new Set(this.matchedJobs.map(job => job.location?.name).filter(Boolean))].sort();
        matchedLocations.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc;
            option.textContent = loc;
            locationFilter.appendChild(option);
        });

        this.renderJobCards(this.matchedJobs, resultsGrid, true);
    }

    renderJobCards(jobs, container, showMatchScore = false) {
        container.innerHTML = '';

        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            
            // Add tier-based classes for styling
            if (showMatchScore && job.matchTier) {
                if (job.matchScore >= 80) card.classList.add('excellent-match');
                else if (job.matchScore >= 60) card.classList.add('strong-match');
                else if (job.matchScore >= 40) card.classList.add('good-match');
            }

            const department = this.detectDepartment(job.title);

            // Build match reasons HTML
            const matchReasonsHtml = showMatchScore && job.matchReasons?.length > 0 
                ? `<div class="match-reasons">${job.matchReasons.slice(0, 3).map(r => `<span class="match-reason">${this.escapeHtml(r)}</span>`).join('')}</div>`
                : '';

            card.innerHTML = `
                ${showMatchScore && job.matchTier ? `
                    <div class="match-score" style="background: linear-gradient(135deg, ${job.matchTier.color}22, ${job.matchTier.color}11); border-left: 3px solid ${job.matchTier.color};">
                        <span class="match-tier-emoji">${job.matchTier.emoji}</span>
                        <span class="match-tier-text">
                            <strong>${job.matchScore}%</strong> ${job.matchTier.name} Match
                        </span>
                    </div>
                ` : ''}
                <h3 class="job-title">${this.escapeHtml(job.title)}</h3>
                <div class="job-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${this.escapeHtml(job.location?.name || 'Remote')}
                </div>
                ${department ? `<span class="job-department">${department}</span>` : ''}
                ${matchReasonsHtml}
                <a class="view-job-btn" href="${job.absolute_url}" target="_blank">
                    View & Apply
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            `;

            card.addEventListener('click', (e) => {
                if (!e.target.closest('.view-job-btn')) {
                    this.openModal(job);
                }
            });

            container.appendChild(card);
        });
    }

    detectDepartment(title) {
        if (!title) return null;
        const t = title.toLowerCase();
        
        if (t.includes('engineer') || t.includes('developer') || t.includes('software')) return 'Engineering';
        if (t.includes('product manager') || t.includes('product design')) return 'Product';
        if (t.includes('designer') || t.includes('ux') || t.includes('ui')) return 'Design';
        if (t.includes('sales') || t.includes('account executive') || t.includes('bdr')) return 'Sales';
        if (t.includes('marketing') || t.includes('brand') || t.includes('content')) return 'Marketing';
        if (t.includes('customer success') || t.includes('support')) return 'Customer Success';
        if (t.includes('finance') || t.includes('fp&a') || t.includes('financial')) return 'Finance';
        if (t.includes('talent') || t.includes('recruiting') || t.includes('people')) return 'People';
        if (t.includes('data') || t.includes('analytics')) return 'Data';
        if (t.includes('security')) return 'Security';
        if (t.includes('operations') || t.includes('ops')) return 'Operations';
        
        return null;
    }

    displayAllJobs() {
        this.filteredJobs = [...this.jobs];
        this.displayedJobs = 0;
        this.loadMoreJobs();
    }

    loadMoreJobs() {
        const container = document.getElementById('all-jobs-grid');
        const loadMoreBtn = document.getElementById('load-more');
        
        const nextBatch = this.filteredJobs.slice(this.displayedJobs, this.displayedJobs + this.jobsPerPage);
        
        nextBatch.forEach(job => {
            const card = this.createJobCard(job);
            container.appendChild(card);
        });

        this.displayedJobs += nextBatch.length;

        // Show/hide load more button
        if (this.displayedJobs < this.filteredJobs.length) {
            loadMoreBtn.classList.remove('hidden');
            loadMoreBtn.textContent = `Load More (${this.filteredJobs.length - this.displayedJobs} remaining)`;
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    }

    createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        const department = this.detectDepartment(job.title);

        card.innerHTML = `
            <h3 class="job-title">${this.escapeHtml(job.title)}</h3>
            <div class="job-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${this.escapeHtml(job.location?.name || 'Remote')}
            </div>
            ${department ? `<span class="job-department">${department}</span>` : ''}
            <a class="view-job-btn" href="${job.absolute_url}" target="_blank">
                View & Apply
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.view-job-btn')) {
                this.openModal(job);
            }
        });

        return card;
    }

    handleSearch(query) {
        const q = query.toLowerCase().trim();
        
        if (q === '') {
            this.filteredJobs = [...this.jobs];
        } else {
            this.filteredJobs = this.jobs.filter(job => 
                job.title?.toLowerCase().includes(q) ||
                job.location?.name?.toLowerCase().includes(q)
            );
        }

        // Reset display and show filtered results
        const container = document.getElementById('all-jobs-grid');
        container.innerHTML = '';
        this.displayedJobs = 0;
        this.loadMoreJobs();

        // Update count
        document.getElementById('all-roles-count').textContent = this.filteredJobs.length;
    }

    handleDepartmentFilter(button) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        if (filter === 'all') {
            this.filteredJobs = [...this.jobs];
        } else {
            this.filteredJobs = this.jobs.filter(job => {
                const dept = this.detectDepartment(job.title);
                return dept?.toLowerCase() === filter;
            });
        }

        // Reset display
        const container = document.getElementById('all-jobs-grid');
        container.innerHTML = '';
        this.displayedJobs = 0;
        this.loadMoreJobs();

        document.getElementById('all-roles-count').textContent = this.filteredJobs.length;
    }

    sortResults() {
        const sortBy = document.getElementById('sort-by').value;
        
        switch (sortBy) {
            case 'match':
                this.matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
                break;
            case 'title':
                this.matchedJobs.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'location':
                this.matchedJobs.sort((a, b) => (a.location?.name || '').localeCompare(b.location?.name || ''));
                break;
        }

        this.renderJobCards(this.matchedJobs, document.getElementById('results-grid'), true);
    }

    filterResults() {
        const locationValue = document.getElementById('filter-location').value;
        
        let filtered = this.matchedJobs;
        
        if (locationValue !== 'all') {
            filtered = this.matchedJobs.filter(job => job.location?.name === locationValue);
        }

        this.renderJobCards(filtered, document.getElementById('results-grid'), true);
        document.getElementById('match-count').textContent = filtered.length;
    }

    async openModal(job) {
        const modal = document.getElementById('job-modal');
        const modalBody = document.getElementById('modal-body');
        
        // Show modal with loading state
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Try to fetch full job details
        let fullJob = job;
        try {
            const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/klaviyo/jobs/${job.id}`);
            if (response.ok) {
                fullJob = await response.json();
            }
        } catch (error) {
            console.log('Could not fetch full job details, using basic info');
        }

        const department = this.detectDepartment(fullJob.title);

        modalBody.innerHTML = `
            <h2 class="modal-job-title">${this.escapeHtml(fullJob.title)}</h2>
            <div class="modal-job-meta">
                <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${this.escapeHtml(fullJob.location?.name || 'Remote')}
                </span>
                ${department ? `
                    <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        ${department}
                    </span>
                ` : ''}
            </div>
            <div class="modal-job-description">
                ${this.decodeHtml(fullJob.content) || '<p>Full job description available on the application page.</p>'}
            </div>
            <a href="${fullJob.absolute_url}" target="_blank" class="modal-apply-btn">
                Apply Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        `;
    }

    closeModal() {
        const modal = document.getElementById('job-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    decodeHtml(html) {
        if (!html) return '';
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new JobMatcher();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
