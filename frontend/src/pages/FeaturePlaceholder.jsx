import { Clock } from 'lucide-react';

export default function FeaturePlaceholder({ title, icon: Icon, description }) {
    return (
        <div className="p-6 flex items-center justify-center min-h-[80vh]">
            <div className="max-w-xl w-full text-center">
                {/* Warm card */}
                <div className="bg-white rounded-3xl p-12"
                    style={{ border: '1.5px solid #FDE68A', boxShadow: '0 8px 40px rgba(253,230,138,0.3)' }}>
                    {/* Icon */}
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8"
                        style={{ background: 'linear-gradient(135deg, #FEF3C7, #DBEAFE)' }}>
                        <Icon size={44} style={{ color: '#1D4ED8' }} />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                        style={{ background: '#FEF3C7', color: '#D97706' }}>
                        <Clock size={14} /> Coming Soon
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-black mb-4" style={{ color: '#0F172A', fontFamily: 'Georgia, serif' }}>
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-base leading-relaxed mb-8" style={{ color: '#64748b' }}>
                        {description || `The ${title} module is currently under development. Soon you'll be able to manage all ${title.toLowerCase()}-related tasks here with high-performance, automated tools.`}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>
                            <span>Development Progress</span>
                            <span style={{ color: '#3b82f6' }}>65%</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                            <div className="h-full rounded-full" style={{
                                width: '65%',
                                background: 'linear-gradient(90deg, #FDE68A, #3b82f6)',
                            }}></div>
                        </div>
                    </div>

                    {/* Placeholder blocks */}
                    <div className="grid grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="h-16 rounded-2xl"
                                style={{
                                    background: ['#FEF3C7', '#DBEAFE', '#D1FAE5', '#EDE9FE'][i],
                                    opacity: 0.6,
                                    animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
                                }}></div>
                        ))}
                    </div>
                </div>

                <p className="mt-6 text-sm" style={{ color: '#D1D5DB' }}>
                    Sqool · Module in development
                </p>
            </div>
        </div>
    );
}
