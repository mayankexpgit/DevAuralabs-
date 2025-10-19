import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Course = {
  id: string;
  title: string;
  icon: React.ElementType;
  rating: number;
  level: string;
  price: number;
  description: string;
  image: string;
};

type CourseCardProps = {
  course: Course;
};

const getPlaceholderImage = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

export default function CourseCard({ course }: CourseCardProps) {
  const { title, icon: Icon, rating, level, price, image } = course;
  const placeholder = getPlaceholderImage(image);

  return (
    <div className="glass-card flex flex-col">
      <div className="relative h-48 w-full">
        {placeholder && (
            <Image
                src={placeholder.imageUrl}
                alt={placeholder.description}
                data-ai-hint={placeholder.imageHint}
                fill
                className="object-cover rounded-t-2xl"
            />
        )}
        <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm p-2 rounded-full">
            <Icon className="h-6 w-6 glowing-icon" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{level}</Badge>
            <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-foreground">{rating}</span>
            </div>
        </div>
        <h3 className="text-xl font-bold mb-2 flex-grow">{title}</h3>
        
        <div className="flex justify-between items-center mt-4">
            <p className="text-2xl font-bold text-primary">${price}</p>
            <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary">
                View Course <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
}
