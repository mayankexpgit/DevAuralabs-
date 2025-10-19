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
  compareAtPrice?: number;
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
  const { title, icon: Icon, rating, level, price, compareAtPrice, image } = course;
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
      <div className="p-4 flex flex-col flex-grow items-center text-center">
        <div className="flex justify-center w-full mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mr-2">{level}</Badge>
            <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-sm text-foreground">{rating}</span>
            </div>
        </div>
        <h3 className="text-lg font-bold mb-2 flex-grow">{title}</h3>
        
        <div className="flex items-baseline gap-2 mb-4 justify-center">
            {compareAtPrice && (
                <p className="text-base text-muted-foreground line-through">${compareAtPrice}</p>
            )}
            <p className="text-xl font-bold text-primary">${price}</p>
        </div>

        <div className="flex flex-col w-full gap-2 mt-auto">
            <Button variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary w-full">
                View Course <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
}
