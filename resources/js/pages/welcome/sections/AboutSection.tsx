import type { JSX } from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    BookOpen,
    Building,
    Calendar,
    Camera,
    Coffee,
    Compass,
    Crown,
    Diamond,
    Eye,
    Flame,
    Gem,
    Gift,
    Globe,
    Handshake,
    Heart,
    Home,
    Infinity,
    Key,
    Leaf,
    Lightbulb,
    Lock,
    Megaphone,
    MessageCircle,
    Music,
    Palette,
    Rocket,
    Search,
    Shield,
    Smile,
    Sparkles,
    Star,
    Sun,
    Target,
    ThumbsUp,
    Trophy,
    TrendingUp,
    Users,
    Zap,
    Puzzle,
} from 'lucide-react';
import type { AboutUs } from '@/pages/welcome/types';

const valueIconMap: Record<string, JSX.Element> = {
    handshake: <Handshake className="h-8 w-8 text-blue-600" />,
    heart: <Heart className="h-8 w-8 text-blue-600" />,
    lightbulb: <Lightbulb className="h-8 w-8 text-blue-600" />,
    trophy: <Trophy className="h-8 w-8 text-blue-600" />,
    shield: <Shield className="h-8 w-8 text-blue-600" />,
    target: <Target className="h-8 w-8 text-blue-600" />,
    users: <Users className="h-8 w-8 text-blue-600" />,
    globe: <Globe className="h-8 w-8 text-blue-600" />,
    search: <Search className="h-8 w-8 text-blue-600" />,
    crown: <Crown className="h-8 w-8 text-blue-600" />,
    award: <Award className="h-8 w-8 text-blue-600" />,
    star: <Star className="h-8 w-8 text-blue-600" />,
    diamond: <Diamond className="h-8 w-8 text-blue-600" />,
    gem: <Gem className="h-8 w-8 text-blue-600" />,
    'trending-up': <TrendingUp className="h-8 w-8 text-blue-600" />,
    rocket: <Rocket className="h-8 w-8 text-blue-600" />,
    zap: <Zap className="h-8 w-8 text-blue-600" />,
    flame: <Flame className="h-8 w-8 text-blue-600" />,
    sparkles: <Sparkles className="h-8 w-8 text-blue-600" />,
    infinity: <Infinity className="h-8 w-8 text-blue-600" />,
    eye: <Eye className="h-8 w-8 text-blue-600" />,
    compass: <Compass className="h-8 w-8 text-blue-600" />,
    sun: <Sun className="h-8 w-8 text-blue-600" />,
    'thumbs-up': <ThumbsUp className="h-8 w-8 text-blue-600" />,
    smile: <Smile className="h-8 w-8 text-blue-600" />,
    puzzle: <Puzzle className="h-8 w-8 text-blue-600" />,
    key: <Key className="h-8 w-8 text-blue-600" />,
    lock: <Lock className="h-8 w-8 text-blue-600" />,
    megaphone: <Megaphone className="h-8 w-8 text-blue-600" />,
    'message-circle': <MessageCircle className="h-8 w-8 text-blue-600" />,
    'book-open': <BookOpen className="h-8 w-8 text-blue-600" />,
    calendar: <Calendar className="h-8 w-8 text-blue-600" />,
    coffee: <Coffee className="h-8 w-8 text-blue-600" />,
    gift: <Gift className="h-8 w-8 text-blue-600" />,
    home: <Home className="h-8 w-8 text-blue-600" />,
    music: <Music className="h-8 w-8 text-blue-600" />,
    palette: <Palette className="h-8 w-8 text-blue-600" />,
    camera: <Camera className="h-8 w-8 text-blue-600" />,
    leaf: <Leaf className="h-8 w-8 text-blue-600" />,
};

const statIconMap: Record<string, JSX.Element> = {
    handshake: <Handshake className="h-6 w-6 text-blue-600" />,
    heart: <Heart className="h-6 w-6 text-blue-600" />,
    lightbulb: <Lightbulb className="h-6 w-6 text-blue-600" />,
    trophy: <Trophy className="h-6 w-6 text-blue-600" />,
    shield: <Shield className="h-6 w-6 text-blue-600" />,
    target: <Target className="h-6 w-6 text-blue-600" />,
    users: <Users className="h-6 w-6 text-blue-600" />,
    globe: <Globe className="h-6 w-6 text-blue-600" />,
    search: <Search className="h-6 w-6 text-blue-600" />,
    crown: <Crown className="h-6 w-6 text-blue-600" />,
    award: <Award className="h-6 w-6 text-blue-600" />,
    star: <Star className="h-6 w-6 text-blue-600" />,
    diamond: <Diamond className="h-6 w-6 text-blue-600" />,
    gem: <Gem className="h-6 w-6 text-blue-600" />,
    'trending-up': <TrendingUp className="h-6 w-6 text-blue-600" />,
    rocket: <Rocket className="h-6 w-6 text-blue-600" />,
    zap: <Zap className="h-6 w-6 text-blue-600" />,
    flame: <Flame className="h-6 w-6 text-blue-600" />,
    sparkles: <Sparkles className="h-6 w-6 text-blue-600" />,
    infinity: <Infinity className="h-6 w-6 text-blue-600" />,
    eye: <Eye className="h-6 w-6 text-blue-600" />,
    compass: <Compass className="h-6 w-6 text-blue-600" />,
    sun: <Sun className="h-6 w-6 text-blue-600" />,
    'thumbs-up': <ThumbsUp className="h-6 w-6 text-blue-600" />,
    smile: <Smile className="h-6 w-6 text-blue-600" />,
    puzzle: <Puzzle className="h-6 w-6 text-blue-600" />,
    key: <Key className="h-6 w-6 text-blue-600" />,
    lock: <Lock className="h-6 w-6 text-blue-600" />,
    megaphone: <Megaphone className="h-6 w-6 text-blue-600" />,
    'message-circle': <MessageCircle className="h-6 w-6 text-blue-600" />,
    'book-open': <BookOpen className="h-6 w-6 text-blue-600" />,
    calendar: <Calendar className="h-6 w-6 text-blue-600" />,
    coffee: <Coffee className="h-6 w-6 text-blue-600" />,
    gift: <Gift className="h-6 w-6 text-blue-600" />,
    home: <Home className="h-6 w-6 text-blue-600" />,
    music: <Music className="h-6 w-6 text-blue-600" />,
    palette: <Palette className="h-6 w-6 text-blue-600" />,
    camera: <Camera className="h-6 w-6 text-blue-600" />,
    leaf: <Leaf className="h-6 w-6 text-blue-600" />,
    'shield-check': <Shield className="h-6 w-6 text-blue-600" />,
};

interface AboutSectionProps {
    aboutUs: AboutUs;
}

const AboutSection = ({ aboutUs }: AboutSectionProps) => (
    <section className="bg-white py-20" id="about">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
                >
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Tentang Kami</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl"
                >
                    Mengenal <span className="text-blue-600">{aboutUs.title}</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto max-w-3xl text-lg text-gray-600"
                >
                    {aboutUs.description}
                </motion.p>
            </div>

            <div className="mb-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
                {aboutUs.values.map((value, index) => (
                    <motion.div
                        key={value.title}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                    >
                        <div className="mb-4 flex justify-center">
                            {valueIconMap[value.icon] ?? <Building className="h-8 w-8 text-blue-600" />}
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">{value.title}</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                        <div className="mt-6 h-1 w-full origin-left scale-x-0 rounded-b-2xl bg-gradient-to-r from-blue-600 to-blue-700 transition-transform duration-300 group-hover:scale-x-100"></div>
                    </motion.div>
                ))}
            </div>

            <div className="mb-12 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                {aboutUs.stats.map((stat, index) => (
                    <motion.div
                        key={`${stat.label}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div className="mb-4 flex items-center justify-center">
                            {statIconMap[stat.icon] ?? <Building className="h-6 w-6 text-blue-600" />}
                        </div>
                        <div className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl">{stat.number}</div>
                        <div className="text-lg font-semibold text-gray-900">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
                >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Target className="h-6 w-6" />
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Misi Kami</h3>
                    <p className="leading-relaxed text-gray-700">{aboutUs.mission}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
                >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Award className="h-6 w-6" />
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Visi Kami</h3>
                    <p className="leading-relaxed text-gray-700">{aboutUs.vision}</p>
                </motion.div>
            </div>
        </div>
    </section>
);

export default AboutSection;
