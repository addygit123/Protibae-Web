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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership of address
    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
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

    // Combine street, houseBuilding, and landmark
    const street = `${data.houseBuilding}\n${data.streetArea}${data.landmark ? `\nLandmark: ${data.landmark}` : ''}`;
    
    // Map home -> SHIPPING, office -> BILLING
    const type = data.addressType === 'home' ? AddressType.SHIPPING : AddressType.BILLING;

    const updatedAddress = await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        // Set all other addresses for this user to isDefault: false
        await tx.address.updateMany({
          where: { userId: session.user.id },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          firstName,
          lastName,
          phone: data.phone,
          zip: data.zip,
          street,
          city: data.city,
          state: data.state,
          type,
          isDefault: data.isDefault,
        },
      });
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('[PATCH /api/addresses/[id]] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership of address
    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/addresses/[id]] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
