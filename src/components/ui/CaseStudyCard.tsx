"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  title: string;
  client: string;
  category: string;
  metric: string;
  imageUrl?: string;
  link?: string;
}

export const CaseStudyCard = ({ title, client, category, metric, imageUrl, link = "#" }: CaseStudyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer flex flex-col gap-4"
    >
      <Link href={link} className="block relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary-surface border border-primary-text/10">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={`${client} - ${title}`} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-muted-text">
            <span>Image Placeholder</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/90 via-primary-bg/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Metric Highlight Badge */}
        <div className="absolute top-4 left-4 bg-accent-blue text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg shadow-accent-blue/20">
          {metric}
        </div>
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-center text-sm font-medium text-muted-text">
          <span className="uppercase tracking-wider">{category}</span>
          <span className="text-primary-text/60">{client}</span>
        </div>
        <Link href={link} className="flex justify-between items-center group/link">
          <h3 className="text-2xl font-bold font-heading text-primary-text group-hover/link:text-accent-blue transition-colors">
            {title}
          </h3>
          <ArrowRight className="text-primary-text/30 group-hover/link:text-accent-blue transition-[color,transform,opacity] duration-300 transform group-hover/link:-rotate-45" size={24} />
        </Link>
      </div>
    </motion.div>
  );
};
