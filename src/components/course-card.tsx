import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Course = {
  id: string;
  title: string;
  icon: React.ElementType;
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
  const { title, icon: Icon, level, price, compareAtPrice, image } = course;
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
        <Badge variant="secondary" className="absolute top-3 left-3 bg-background/70 backdrop-blur-sm text-primary border-primary/20 text-xs">
            {level}
        </Badge>
        <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm p-2 rounded-full">
            <Icon className="h-6 w-6 glowing-icon" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow items-center text-center">
        <h3 className="text-base font-bold mb-2 flex-grow">{title}</h3>
        
        <div className="flex items-baseline gap-2 mb-4 justify-center">
            {compareAtPrice && (
                <p className="text-sm text-muted-foreground line-through">${compareAtPrice}</p>
            )}
            <p className="text-lg font-bold text-primary">${price}</p>
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
