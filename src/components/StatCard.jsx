import React from 'react';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

export default function StatCard({ title, value, icon, trend, colorClass = "text-brand-blue", bgClass = "bg-blue-50" }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{title}</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>

                    {trend !== undefined && (
                        <div className={`flex items-center gap-1.5 mt-3 text-xs font-bold px-2.5 py-1 rounded-full inline-flex
              ${trend > 0 ? 'text-green-700 bg-green-100/50' : 'text-red-600 bg-red-100/50'}`}>
                            {trend > 0 ? <MdTrendingUp className="w-4 h-4" /> : <MdTrendingDown className="w-4 h-4" />}
                            <span>{Math.abs(trend)}% vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`p-4 rounded-2xl ${bgClass} ${colorClass} group-hover:rotate-6 group-hover:scale-110 shadow-sm transition-all duration-300`}>
                    <div className="w-6 h-6 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
