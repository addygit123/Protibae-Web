import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AddressType } from '@prisma/client';
import { z } from 'zod';

const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  zip: z.string().min(5, 'ZIP / PIN Code must be at least 5 digits'),
  landmark: z.string().optional(),
  houseBuilding: z.string().min(1, 'House/Flat/Building info is required'),
  streetArea: z.string().min(1, 'Street/Area info is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  addressType: z.enum(['home', 'office']),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('[GET /api/addresses] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid address data', details: result.error.issues },
        { status: 422 }
      );
    }

    const data = result.data;
    
    // Split Full Name
    const nameParts = data.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '.';

    // Combine street, houseBuilding, and landmark with newline
    const street = `${data.houseBuilding}\n${data.streetArea}${data.landmark ? `\nLandmark: ${data.landmark}` : ''}`;
    
    // Map home -> SHIPPING, office -> BILLING
    const type = data.addressType === 'home' ? AddressType.SHIPPING : AddressType.BILLING;

    const newAddress = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        // Set all other addresses for this user to isDefault: false
        await tx.address.updateMany({
          where: { userId: session.user.id },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId: session.user.id,
          firstName,
          lastName,
          phone: data.phone,
          zip: data.zip,
          street,
          city: data.city,
          state: data.state,
          country: 'IN',
          type,
          isDefault: data.isDefault,
        },
      });
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('[POST /api/addresses] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
