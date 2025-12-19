'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { UserProfile } from '@/types';
import { Card } from './Card';
import { User, Check, X, ShieldCheck, PlusCircle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

export function Profile({ onComplete }: { onComplete: () => void }) {
    const existingProfile = useLiveQuery(() => db.profile.toCollection().first());
    const [formData, setFormData] = useState<UserProfile>({
        name: '',
        diabetesType: 'Type 2',
        targetFastingMin: 70,
        targetFastingMax: 100,
        targetPostPrandialMin: 120,
        targetPostPrandialMax: 140,
        unit: 'mg/dL'
    });

    useEffect(() => {
        if (existingProfile) {
            setFormData(existingProfile);
        }
    }, [existingProfile]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.id) {
            await db.profile.update(formData.id, formData);
        } else {
            await db.profile.add(formData);
        }
        onComplete();
    };

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <User className="w-5 h-5 font-black" />
                <h2 className="text-xl font-black">Your Profile</h2>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="flex flex-col items-center mb-2">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                            {formData.photo ? (
                                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-300" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform">
                            <PlusCircle className="w-4 h-4 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    </div>
                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest mt-3">Profile Photo</span>
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1.5 block px-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary/50 focus:bg-white outline-none font-bold transition-all text-base"
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1.5 block px-1">Diabetes Type</label>
                    <select
                        value={formData.diabetesType}
                        onChange={e => setFormData({ ...formData, diabetesType: e.target.value as any })}
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary/50 focus:bg-white outline-none font-bold transition-all text-base appearance-none"
                    >
                        <option>Type 1</option>
                        <option>Type 2</option>
                        <option>Pre-diabetic</option>
                        <option>Gestational</option>
                    </select>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-sm font-black uppercase tracking-wider">Target Ranges (mg/dL)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Fasting Min</label>
                            <input
                                type="number"
                                value={formData.targetFastingMin}
                                onChange={e => setFormData({ ...formData, targetFastingMin: parseInt(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-100 font-bold text-base"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Fasting Max</label>
                            <input
                                type="number"
                                value={formData.targetFastingMax}
                                onChange={e => setFormData({ ...formData, targetFastingMax: parseInt(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-100 font-bold text-base"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-gray-400 mb-1 block">PP Min</label>
                            <input
                                type="number"
                                value={formData.targetPostPrandialMin}
                                onChange={e => setFormData({ ...formData, targetPostPrandialMin: parseInt(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-100 font-bold text-base"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-gray-400 mb-1 block">PP Max</label>
                            <input
                                type="number"
                                value={formData.targetPostPrandialMax}
                                onChange={e => setFormData({ ...formData, targetPostPrandialMax: parseInt(e.target.value) })}
                                className="w-full p-3 rounded-lg bg-white border border-gray-100 font-bold text-base"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onComplete}
                        className="flex-1 py-4 px-4 rounded-2xl border border-gray-100 font-bold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        <X className="w-5 h-5" /> Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-[2] py-4 px-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Check className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </form>
        </Card>
    );
}
